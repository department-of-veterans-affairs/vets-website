/**
 * Error constants for form error handling.
 * Separated to avoid circular dependencies.
 * @module error-constants
 */

/**
 * Error severity levels for categorization.
 * @enum {string}
 */
export const ErrorSeverity = {
  /** Critical errors that prevent form submission */
  CRITICAL: 'critical',
  /** Errors that need correction but don't block progress */
  ERROR: 'error',
  /** Warnings that should be addressed but are not blocking */
  WARNING: 'warning',
  /** Informational messages */
  INFO: 'info',
};

/**
 * Error types for categorization and handling.
 * @enum {string}
 */
export const ErrorType = {
  /** Field-specific validation errors */
  FIELD: 'field',
  /** Form-level validation errors */
  FORM: 'form',
  /** Validation errors from schema */
  VALIDATION: 'validation',
  /** Network or API errors */
  NETWORK: 'network',
  /** Authentication/authorization errors */
  AUTH: 'auth',
  /** Business logic errors */
  BUSINESS: 'business',
  /** System or unexpected errors */
  SYSTEM: 'system',
};

/**
 * Standard error codes for consistent handling.
 * @enum {string}
 */
export const ErrorCode = {
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_RANGE: 'INVALID_RANGE',
  DUPLICATE_VALUE: 'DUPLICATE_VALUE',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',

  // System errors
  SYSTEM_ERROR: 'SYSTEM_ERROR',

  // Auth errors
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Business errors
  ELIGIBILITY_ERROR: 'ELIGIBILITY_ERROR',
  DUPLICATE_SUBMISSION: 'DUPLICATE_SUBMISSION',
  EXPIRED_FORM: 'EXPIRED_FORM',
};
