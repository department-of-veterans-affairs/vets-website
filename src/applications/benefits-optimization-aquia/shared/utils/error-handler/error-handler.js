import { FormError } from '../form-error';
import { logger } from '../logger';

/**
 * Error handler class for centralized error processing.
 * @class ErrorHandler
 */
export class ErrorHandler {
  constructor(options = {}) {
    this.options = {
      logToConsole: true,
      ...options,
    };
    this.handlers = new Map();
  }

  /**
   * Handle an error.
   * @param {Error|FormError|string} error - Error to handle
   * @returns {Object} Result with handled flag and display message
   */
  handleError(error) {
    const formError =
      error instanceof FormError
        ? error
        : new FormError(error instanceof Error ? error.message : String(error));

    if (this.handlers.has(formError.code)) {
      const customHandler = this.handlers.get(formError.code);
      return customHandler(formError, this.defaultHandler.bind(this));
    }

    return this.defaultHandler(formError);
  }

  /**
   * Default error handler.
   * @private
   * @param {FormError} error - Error to handle
   * @returns {Object} Error handling result
   */
  defaultHandler(error) {
    if (this.options.logToConsole) {
      logger.error('Error handled', error);
    }

    return {
      handled: true,
      displayMessage: error.userMessage || error.message,
      error,
    };
  }

  /**
   * Register a custom error handler.
   * @param {string} code - Error code
   * @param {Function} handler - Handler function
   */
  registerHandler(code, handler) {
    this.handlers.set(code, handler);
  }

  /**
   * Set handler options.
   * @param {Object} options - New options
   */
  setOptions(options) {
    this.options = { ...this.options, ...options };
  }
}
