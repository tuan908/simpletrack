"use server";

import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { AuthProvider, NextAuthProvider, User } from "./auth-provider";
import { Logger, ProductionLogger } from "./logger";
import { rateLimiter } from "./rate-limiter";
import { ActionContext, ActionResult, ErrorCode } from "./types";

interface CreateActionConfig<TInput, TOutput> {
  name: string;
  description?: string;
  schema: z.ZodSchema<TInput>;
  requiresAuth?: boolean;
  roles?: string[];
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  handler: (
    input: TInput,
    context: ActionContext,
    user: User | null,
  ) => Promise<TOutput>;
}

/**
 * Factory function to create type-safe server actions with middleware
 */
export async function createAction<TInput, TOutput>(
  config: CreateActionConfig<TInput, TOutput>,
) {
  const authProvider: AuthProvider = new NextAuthProvider();
  return async (rawInput: TInput): Promise<ActionResult<TOutput>> => {
    const headerList = await headers();
    const requestId = uuidv4();
    const startTime = performance.now();

    const logger = new ProductionLogger({
      action: config.name,
      requestId,
    });

    try {
      // 1. Build Action Context
      const context = await buildContext(requestId, logger, headerList);

      logger.info("Action started", { input: rawInput });

      // 2. Authentication Check
      const user = await authProvider.getCurrentUser();

      if (config.requiresAuth && !user) {
        logger.warn("Unauthorized access attempt");
        return createErrorResult(
          ErrorCode.UNAUTHORIZED,
          "Authentication required",
        );
      }

      // 3. Authorization Check (Role-based)
      if (config.roles && config.roles.length > 0 && user) {
        if (!authProvider.hasRole(user, config.roles)) {
          logger.warn("Forbidden access attempt", {
            userId: user.id,
            requiredRoles: config.roles,
            userRoles: user.roles,
          });
          return createErrorResult(
            ErrorCode.FORBIDDEN,
            "Insufficient permissions",
          );
        }
      }

      // 4. Rate Limiting
      if (config.rateLimit) {
        const rateLimitKey = user
          ? `user:${user.id}`
          : `ip:${context.ipAddress}`;
        const { allowed, remaining } = await rateLimiter.checkLimit(
          rateLimitKey,
          config.rateLimit,
        );

        if (!allowed) {
          logger.warn("Rate limit exceeded", { key: rateLimitKey });
          return createErrorResult(
            ErrorCode.RATE_LIMIT_EXCEEDED,
            "Too many requests. Please try again later.",
          );
        }

        logger.debug("Rate limit check passed", { remaining });
      }

      // 5. Input Validation
      const validationResult = config.schema.safeParse(rawInput);

      if (!validationResult.success) {
        logger.warn("Validation failed", {
          errors: validationResult.error.flatten(),
        });
        return createErrorResult(
          ErrorCode.VALIDATION_ERROR,
          "Invalid input",
          validationResult.error.flatten(),
        );
      }

      const validatedInput = validationResult.data;

      // 6. Execute Handler
      const result = await config.handler(validatedInput, context, user);

      // 7. Success Metrics
      const duration = performance.now() - startTime;
      logger.info("Action completed successfully", {
        duration,
        userId: user?.id,
      });

      return { success: true, data: result };
    } catch (error) {
      // 8. Error Handling
      const duration = performance.now() - startTime;
      logger.error("Action failed", error as Error, { duration });

      // Don't leak internal errors to client
      if (process.env.NODE_ENV === "production") {
        return createErrorResult(
          ErrorCode.INTERNAL_ERROR,
          "An unexpected error occurred",
        );
      }

      return createErrorResult(
        ErrorCode.INTERNAL_ERROR,
        error instanceof Error ? error.message : "Unknown error",
        error,
      );
    }
  };
}

/**
 * Build execution context from request headers
 */
async function buildContext(
  requestId: string,
  logger: Logger,
  headersList: ReadonlyHeaders,
): Promise<ActionContext> {
  try {
    return {
      requestId,
      ipAddress:
        headersList.get("x-forwarded-for")?.split(",")[0] ||
        headersList.get("x-real-ip") ||
        "unknown",
      userAgent: headersList.get("user-agent") || "unknown",
      timestamp: new Date(),
    };
  } catch (error) {
    logger.warn("Failed to build context", { error });
    return {
      requestId,
      ipAddress: "unknown",
      userAgent: "unknown",
      timestamp: new Date(),
    };
  }
}

/**
 * Helper to create error results
 */
function createErrorResult(
  code: ErrorCode,
  message: string,
  details?: unknown,
): ActionResult<never> {
  const statusCodeMap: Record<ErrorCode, number> = {
    [ErrorCode.UNAUTHORIZED]: 401,
    [ErrorCode.FORBIDDEN]: 403,
    [ErrorCode.NOT_FOUND]: 404,
    [ErrorCode.VALIDATION_ERROR]: 400,
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
    [ErrorCode.BAD_REQUEST]: 400,
    [ErrorCode.INTERNAL_ERROR]: 500,
  };

  return {
    success: false,
    error: {
      code,
      message,
      details,
      statusCode: statusCodeMap[code],
    },
  };
}
