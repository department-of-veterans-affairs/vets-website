/**
 * Enhanced error class with additional metadata for form errors.
 * @module form-error
 */

import { ErrorCode, ErrorSeverity, ErrorType } from '../error-constants';

/**
 * Enhanced error class with additional metadata.
 * @class FormError
 * @extends {Error}
 */
export class FormError extends Error {
  /**
   * Creates a FormError instance.
   * @param {string} message - Error message
   * @param {Object} [options={}] - Additional error options
   * @param {string} [options.code] - Error code from ErrorCode enum
   * @param {string} [options.type] - Error type from ErrorType enum
   * @param {string} [options.severity] - Error severity from ErrorSeverity enum
   * @param {string} [options.field] - Field name associated with error
   * @param {string} [options.userMessage] - User-friendly error message
   * @param {Object} [options.metadata] - Additional metadata
   * @param {Error} [options.originalError] - Original error if wrapping
   * @param {Object} [options.context] - Additional context
   */
  constructor(message, options = {}) {
    super(message);
    this.name = 'FormError';
    this.code = options.code || ErrorCode.SYSTEM_ERROR;
    this.type = options.type || ErrorType.SYSTEM;
    this.severity = options.severity || ErrorSeverity.ERROR;
    this.field = options.field;
    this.userMessage = options.userMessage;
    this.context = options.context;
    this.metadata = options.metadata || {};
    this.originalError = options.originalError;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FormError);
    }
  }

  /**
   * Convert error to plain object for serialization.
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      userMessage: this.userMessage,
      code: this.code,
      type: this.type,
      severity: this.severity,
      field: this.field,
      metadata: this.metadata,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}
