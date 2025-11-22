// lib/server-actions/rate-limiter.ts

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * In-memory rate limiter (use Redis in production for distributed systems)
 */
export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();

  async checkLimit(
    key: string,
    config: RateLimitConfig,
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    const entry = this.store.get(key);

    // Clean up expired entries
    if (entry && now > entry.resetAt) {
      this.store.delete(key);
    }

    const current = this.store.get(key);

    if (!current) {
      const resetAt = now + config.windowMs;
      this.store.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: config.maxRequests - 1, resetAt };
    }

    if (current.count >= config.maxRequests) {
      return { allowed: false, remaining: 0, resetAt: current.resetAt };
    }

    current.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - current.count,
      resetAt: current.resetAt,
    };
  }

  // Cleanup method - run periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Cleanup every minute
if (typeof window === "undefined") {
  setInterval(() => rateLimiter.cleanup(), 60000);
}
