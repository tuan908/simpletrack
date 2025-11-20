// core/contracts/Result.ts

export type ResultSuccess<T> = {
  ok: true;
  value: T;
};

export type ResultFailure<E = unknown> = {
  ok: false;
  errors: E;
};

export type Result<T, E = unknown> = ResultSuccess<T> | ResultFailure<E>;

/**
 * Helper namespace-style object so you can write:
 *   Result.ok(...)
 *   Result.fail(...)
 */
export const Result = {
  ok<T, E = never>(value: T): Result<T, E> {
    return { ok: true, value };
  },

  fail<T = never, E = unknown>(errors: E): Result<T, E> {
    return { ok: false, errors };
  },

  /**
   * Combine multiple results:
   * - returns first failure if any
   * - otherwise returns ok(void)
   */
  combine<E = unknown>(results: Result<unknown, E>[]): Result<void, E> {
    for (const r of results) {
      if (!r.ok) return r;
    }
    return { ok: true, value: undefined };
  },
};
