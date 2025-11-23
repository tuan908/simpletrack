// core/contracts/ErrorCodes.ts

export enum ErrorCode {
  // Generic
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  NOT_FOUND = "NOT_FOUND",

  // Auth
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",

  // Contacts
  CONTACT_NOT_FOUND = "CONTACT_NOT_FOUND",
  DUPLICATE_EMAIL = "DUPLICATE_EMAIL",
  DUPLICATE_PHONE = "DUPLICATE_PHONE",
  INVALID_CONTACT_STATUS = "INVALID_CONTACT_STATUS",

  // Notes
  NOTE_NOT_FOUND = "NOTE_NOT_FOUND",
  INVALID_NOTE_TYPE = "INVALID_NOTE_TYPE",

  // Reminders
  REMINDER_NOT_FOUND = "REMINDER_NOT_FOUND",
  PAST_DUE_DATE = "PAST_DUE_DATE",

  // Database
  DATABASE_ERROR = "DATABASE_ERROR",
  CONSTRAINT_VIOLATION = "CONSTRAINT_VIOLATION",
}

export type ErrorDetail = {
  field?: string; // Optional: which field failed (e.g., "email")
  message: string; // Required: human-readable error
  code?: ErrorCode; // Optional: machine-readable code (e.g., "DUPLICATE_EMAIL")
};
