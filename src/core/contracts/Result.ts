import type { ErrorCode, ErrorDetail } from "./ErrorCodes";

// core/contracts/Result.ts
export type ResultSuccess<T> = {
  ok: true;
  value: T;
};

export type ResultFailure = {
  ok: false;
  errors: ErrorDetail[]; // Always an array of structured errors
};

export type Result<T> = ResultSuccess<T> | ResultFailure;

export const Result = {
  ok<T>(value: T): Result<T> {
    return { ok: true, value };
  },

  fail<T = never>(errors: ErrorDetail[]): Result<T> {
    return { ok: false, errors };
  },

  // Convenience helper for single error
  failWith<T = never>(
    message: string,
    field?: string,
    code?: ErrorCode,
  ): Result<T> {
    return { ok: false, errors: [{ message, field, code }] };
  },

  combine(results: Result<unknown>[]): Result<void> {
    for (const r of results) {
      if (!r.ok) return r;
    }
    return { ok: true, value: undefined };
  },
};
