// core/errors/ValidationError.ts

/**
 * Shape compatible with Zod's `flatten().fieldErrors`:
 *   { [fieldName: string]: string[] }
 */
export type ValidationErrors = Record<string, string[]>;

/**
 * For invalid input (DTO/command/query validation).
 *
 * Example:
 *   throw new ValidationError({
 *     email: ['Email is invalid'],
 *     password: ['Password is too short'],
 *   });
 */
export class ValidationError extends Error {
  public readonly errors: ValidationErrors;

  constructor(errors: ValidationErrors, message = "Validation failed") {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
