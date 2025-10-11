import { ErrorCode, ErrorSeverity, ErrorType } from '../error-constants';
import { FormError } from '../form-error';
import { logger } from '../logger';

/**
 * Enhanced error handling utilities for forms.
 * Provides comprehensive error management, transformation, and user feedback.
 *
 * @module error-handling
 */

export { ErrorCode, ErrorSeverity, ErrorType } from '../error-constants';
export { FormError } from '../form-error';

/**
 * Error collection for managing multiple errors.
 * @class ErrorCollection
 */
export class ErrorCollection {
  constructor() {
    this.errors = new Map();
    this.globalErrors = [];
  }

  /**
   * Add a field-specific error.
   * @param {string} field - Field name
   * @param {string|FormError} error - Error message or FormError instance
   */
  addFieldError(field, error) {
    const formError =
      error instanceof FormError ? error : new FormError(error, { field });

    if (!this.errors.has(field)) {
      this.errors.set(field, []);
    }
    this.errors.get(field).push(formError);
  }

  /**
   * Add a global error not associated with a specific field.
   * @param {string|FormError} error - Error message or FormError instance
   */
  addGlobalError(error) {
    const formError = error instanceof FormError ? error : new FormError(error);
    this.globalErrors.push(formError);
  }

  /**
   * Clear errors for a specific field.
   * @param {string} field - Field name
   */
  clearFieldErrors(field) {
    this.errors.delete(field);
  }

  /**
   * Clear all errors.
   */
  clearAllErrors() {
    this.errors.clear();
    this.globalErrors = [];
  }

  /**
   * Get errors for a specific field.
   * @param {string} field - Field name
   * @returns {FormError[]} Array of errors for the field
   */
  getFieldErrors(field) {
    return this.errors.get(field) || [];
  }

  /**
   * Get first error for a specific field.
   * @param {string} field - Field name
   * @returns {FormError|null} First error for the field
   */
  getFieldError(field) {
    const errors = this.getFieldErrors(field);
    return errors.length > 0 ? errors[0] : null;
  }

  /**
   * Check if there are any errors.
   * @returns {boolean} True if there are errors
   */
  hasErrors() {
    return this.errors.size > 0 || this.globalErrors.length > 0;
  }

  /**
   * Check if a specific field has errors.
   * @param {string} field - Field name
   * @returns {boolean} True if field has errors
   */
  hasFieldErrors(field) {
    return this.errors.has(field) && this.errors.get(field).length > 0;
  }

  /**
   * Get all errors grouped by severity.
   * @returns {Object} Errors grouped by severity
   */
  getErrorsBySeverity() {
    const grouped = {
      [ErrorSeverity.CRITICAL]: [],
      [ErrorSeverity.ERROR]: [],
      [ErrorSeverity.WARNING]: [],
      [ErrorSeverity.INFO]: [],
    };

    this.errors.forEach(errors => {
      errors.forEach(error => {
        grouped[error.severity].push(error);
      });
    });

    this.globalErrors.forEach(error => {
      grouped[error.severity].push(error);
    });

    return grouped;
  }

  /**
   * Convert to plain object for form display.
   * @returns {Object} Plain object with field errors
   */
  toFieldErrors() {
    const fieldErrors = {};
    this.errors.forEach((errors, field) => {
      if (errors.length > 0) {
        fieldErrors[field] = errors[0].message;
      }
    });
    return fieldErrors;
  }

  /**
   * Get all errors (field and global).
   * @returns {FormError[]} Array of all errors
   */
  getAllErrors() {
    const allErrors = [];
    this.errors.forEach(errors => {
      allErrors.push(...errors);
    });
    allErrors.push(...this.globalErrors);
    return allErrors;
  }

  /**
   * Get error summary.
   * @returns {Object} Summary with field errors and global errors
   */
  getErrorSummary() {
    return {
      fieldErrors: this.toFieldErrors(),
      globalErrors: this.globalErrors,
    };
  }

  /**
   * Get first error (field or global).
   * @returns {FormError|null} First error found
   */
  getFirstError() {
    for (const errors of this.errors.values()) {
      if (errors.length > 0) {
        return errors[0];
      }
    }
    if (this.globalErrors.length > 0) {
      return this.globalErrors[0];
    }
    return null;
  }

  /**
   * Merge another ErrorCollection into this one.
   * @param {ErrorCollection} other - Other error collection to merge
   */
  mergeCollection(other) {
    other.errors.forEach((errors, field) => {
      errors.forEach(error => {
        this.addFieldError(field, error);
      });
    });
    other.globalErrors.forEach(error => {
      this.addGlobalError(error);
    });
  }
}

/**
 * Transform Zod validation errors to FormError instances.
 * Used internally for error-handling. For flat object transforms, use zod-integration.
 * @private
 * @param {import('zod').ZodError} zodError - Zod validation error
 * @returns {ErrorCollection} Collection of form errors
 */
const transformZodErrorsToCollection = zodError => {
  const collection = new ErrorCollection();

  if (!zodError || !zodError.issues) {
    return collection;
  }

  zodError.issues.forEach(issue => {
    const field = issue.path.join('.');
    const error = new FormError(issue.message, {
      code: ErrorCode.INVALID_FORMAT,
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.ERROR,
      field: field || undefined,
      metadata: {
        zodCode: issue.code,
        expected: issue.expected,
        received: issue.received,
      },
    });

    if (field) {
      collection.addFieldError(field, error);
    } else {
      collection.addGlobalError(error);
    }
  });

  return collection;
};

export { transformZodErrorsToCollection };

/**
 * Transform network errors to FormError instances.
 * @param {Error} error - Network error
 * @returns {FormError} Form error instance
 */
export const transformNetworkError = error => {
  if (error.message.includes('fetch')) {
    return new FormError(
      'Unable to connect to the server. Please check your internet connection.',
      {
        code: ErrorCode.NETWORK_ERROR,
        type: ErrorType.NETWORK,
        severity: ErrorSeverity.CRITICAL,
        originalError: error,
      },
    );
  }

  if (error.message.includes('timeout')) {
    return new FormError('The request took too long. Please try again.', {
      code: ErrorCode.TIMEOUT,
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.ERROR,
      originalError: error,
    });
  }

  return new FormError('A network error occurred. Please try again later.', {
    code: ErrorCode.NETWORK_ERROR,
    type: ErrorType.NETWORK,
    severity: ErrorSeverity.ERROR,
    originalError: error,
  });
};

/**
 * Error recovery strategies for different error types.
 * @namespace ErrorRecovery
 */
export const ErrorRecovery = {
  /**
   * Suggest recovery action for an error.
   * @param {FormError} error - Error to recover from
   * @returns {Object} Recovery suggestion
   */
  suggestRecovery(error) {
    const suggestions = {
      [ErrorCode.NETWORK_ERROR]: {
        action: 'retry',
        message: 'Check your internet connection and try again',
        canRetry: true,
      },
      [ErrorCode.SESSION_EXPIRED]: {
        action: 'login',
        message: 'Your session has expired. Please log in again',
        canRetry: false,
      },
      [ErrorCode.REQUIRED_FIELD]: {
        action: 'fill',
        message: 'Please fill in all required fields',
        canRetry: false,
      },
      [ErrorCode.SERVER_ERROR]: {
        action: 'wait',
        message: 'The server is experiencing issues. Please try again later',
        canRetry: true,
      },
    };

    return (
      suggestions[error.code] || {
        action: 'contact',
        message: 'If this problem persists, please contact support',
        canRetry: false,
      }
    );
  },

  /**
   * Attempt automatic recovery for certain error types.
   * @param {FormError} error - Error to recover from
   * @param {Function} retryFn - Function to retry
   * @returns {Promise<boolean>} Whether recovery was successful
   */
  async attemptRecovery(error, retryFn) {
    const recovery = this.suggestRecovery(error);

    if (!recovery.canRetry) {
      return false;
    }

    logger.info('Attempting error recovery', {
      errorCode: error.code,
      action: recovery.action,
    });

    try {
      await retryFn();
      logger.info('Error recovery successful');
      return true;
    } catch (retryError) {
      logger.error('Error recovery failed', retryError);
      return false;
    }
  },
};

/**
 * Create an error summary component data structure.
 * @param {ErrorCollection} errorCollection - Collection of errors
 * @returns {Object} Error summary data
 */
export const createErrorSummary = errorCollection => {
  const errors = errorCollection.getErrorsBySeverity();
  const criticalCount = errors[ErrorSeverity.CRITICAL].length;
  const errorCount = errors[ErrorSeverity.ERROR].length;
  const warningCount = errors[ErrorSeverity.WARNING].length;

  return {
    hasErrors: errorCollection.hasErrors(),
    hasCritical: criticalCount > 0,
    counts: {
      critical: criticalCount,
      error: errorCount,
      warning: warningCount,
      total: criticalCount + errorCount + warningCount,
    },
    errors,
    fieldErrors: errorCollection.toFieldErrors(),
    globalErrors: errorCollection.globalErrors,
  };
};

/**
 * Format error message for user display.
 * @param {FormError|string} error - Error to format
 * @param {Object} [options={}] - Formatting options
 * @param {boolean} [options.includeField=false] - Include field name
 * @param {boolean} [options.includeCode=false] - Include error code
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error, options = {}) => {
  const { includeField = false, includeCode = false } = options;

  if (typeof error === 'string') {
    return error;
  }

  let { message } = error;

  if (includeField && error.field) {
    message = `${error.field}: ${message}`;
  }

  if (includeCode && error.code) {
    message = `${message} (${error.code})`;
  }

  return message;
};

export { ErrorHandler } from '../error-handler';

/**
 * Format error for display (alias for formatErrorMessage).
 * @param {Error|FormError|string|null|undefined} error - Error to format
 * @param {Object} [options={}] - Formatting options
 * @param {boolean} [options.includeField=false] - Include field name
 * @param {string} [options.fieldPrefix=''] - Prefix for field name
 * @returns {string} Formatted error message
 */
export const formatErrorForDisplay = (error, options = {}) => {
  if (error === null || error === undefined) {
    return 'An error occurred';
  }

  if (error instanceof FormError) {
    const message = error.userMessage || error.message;
    if (options.includeField && error.field) {
      const prefix = options.fieldPrefix || 'Field: ';
      return `${prefix}${error.field}: ${message}`;
    }
    return message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

/**
 * Check if an error is recoverable.
 * @param {Error|FormError} error - Error to check
 * @returns {boolean} True if recoverable
 */
export const isRecoverableError = error => {
  if (!(error instanceof FormError)) {
    return true;
  }

  if (error.severity === ErrorSeverity.CRITICAL) {
    return false;
  }

  if (error.code === ErrorCode.AUTHORIZATION_ERROR) {
    return false;
  }

  if (
    error.code === ErrorCode.NETWORK_ERROR ||
    error.code === ErrorCode.VALIDATION_ERROR
  ) {
    return true;
  }

  return error.severity !== ErrorSeverity.CRITICAL;
};

/**
 * Log an error with appropriate severity.
 * @param {Error|FormError} error - Error to log
 * @param {Object} [context] - Additional context
 */
export const logError = (error, context) => {
  const severity =
    error instanceof FormError ? error.severity : ErrorSeverity.ERROR;
  const logContext =
    error instanceof FormError && error.context
      ? { ...error.context, ...context }
      : context;

  switch (severity) {
    case ErrorSeverity.INFO:
      if (logContext) {
        logger.info(error.message, { context: logContext });
      } else {
        logger.info(error.message);
      }
      break;
    case ErrorSeverity.WARNING:
      if (logContext) {
        logger.warn(error.message, { context: logContext });
      } else {
        logger.warn(error.message);
      }
      break;
    case ErrorSeverity.CRITICAL:
    case ErrorSeverity.ERROR:
    default:
      if (logContext) {
        logger.error(error.message, { context: logContext });
      } else {
        logger.error(error.message);
      }
      break;
  }
};

/**
 * Create error boundary configuration.
 * @param {Object} options - Boundary options
 * @param {Function} [options.onError] - Error callback
 * @param {*} [options.fallback] - Fallback UI
 * @param {Array} [options.resetKeys] - Keys that trigger reset
 * @returns {Object} Error boundary configuration
 */
export const createErrorBoundary = (options = {}) => {
  return {
    onError: (error, errorInfo) => {
      logError(error, errorInfo);
      if (options.onError) {
        options.onError(error, errorInfo);
      }
    },
    fallback: options.fallback || 'An error occurred',
    resetKeys: options.resetKeys || [],
  };
};
