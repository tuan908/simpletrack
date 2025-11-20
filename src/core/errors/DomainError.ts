// core/errors/DomainError.ts

/**
 * For business rule violations in the domain.
 *
 * Example:
 *   throw new DomainError('User must be at least 18', 'USER_TOO_YOUNG');
 */
export class DomainError extends Error {
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.details = details;

    // Fix the prototype chain (important when targeting ES5)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
