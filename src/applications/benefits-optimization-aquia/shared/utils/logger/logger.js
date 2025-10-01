/**
 * Centralized logging utility for the Share Utility.
 * Provides environment-aware logging with support for different log levels
 * and integration with monitoring services.
 *
 * @module logger
 */

/**
 * Determines if the current environment is development
 * @returns {boolean} True if in development environment
 */
const isDevelopment = () => {
  return (
    typeof process !== 'undefined' &&
    process.env &&
    process.env.NODE_ENV === 'development'
  );
};

/**
 * Determines if the current environment is test
 * @returns {boolean} True if in test environment
 */
const isTest = () => {
  return (
    typeof process !== 'undefined' &&
    process.env &&
    process.env.NODE_ENV === 'test'
  );
};

/**
 * Formats log data for consistent output
 * @param {*} data - Data to format
 * @returns {string} Formatted data string
 */
const formatData = data => {
  if (data === undefined) return '';
  if (data === null) return 'null';
  if (typeof data === 'object') {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return '[Circular or non-serializable object]';
    }
  }
  return String(data);
};

/**
 * Sends error data to monitoring service (e.g., Sentry, DataDog)
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {*} data - Additional data
 * @private
 */
const sendToMonitoring = (level, message, data) => {
  // Integration point for monitoring services
  // This would be implemented based on the specific monitoring service used
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'log-event',
      logLevel: level,
      logMessage: message,
      logData: formatData(data),
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Logger object providing different log levels with environment awareness
 * @namespace logger
 */
export const logger = {
  /**
   * Debug level logging - only outputs in development
   * @param {string} message - Debug message
   * @param {*} [data] - Optional data to log
   * @example
   * logger.debug('Form validation started', { formId: 'BURIAL_FLAGS' });
   */
  debug: (message, data) => {
    if (isDevelopment() && !isTest()) {
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ${message}`, data !== undefined ? data : '');
    }
  },

  /**
   * Info level logging - outputs in development and production
   * @param {string} message - Info message
   * @param {*} [data] - Optional data to log
   * @example
   * logger.info('Form submitted successfully', { formId: 'BURIAL_FLAGS' });
   */
  info: (message, data) => {
    if (!isTest()) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, data !== undefined ? data : '');
    }
    sendToMonitoring('info', message, data);
  },

  /**
   * Warning level logging - outputs in all environments
   * @param {string} message - Warning message
   * @param {*} [data] - Optional data to log
   * @example
   * logger.warn('Validation warning', { field: 'ssn', issue: 'format' });
   */
  warn: (message, data) => {
    if (!isTest()) {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, data !== undefined ? data : '');
    }
    sendToMonitoring('warn', message, data);
  },

  /**
   * Error level logging - outputs in all environments
   * @param {string} message - Error message
   * @param {Error|*} [error] - Error object or additional data
   * @example
   * logger.error('Form submission failed', error);
   */
  error: (message, error) => {
    if (!isTest()) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, error !== undefined ? error : '');
    }

    // Extract error details for monitoring
    const errorData =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error;

    sendToMonitoring('error', message, errorData);
  },

  /**
   * Performance timing logger - logs timing data for performance monitoring
   * @param {string} operation - Operation being timed
   * @param {number} duration - Duration in milliseconds
   * @param {*} [metadata] - Additional metadata
   * @example
   * const start = performance.now();
   * // ... operation ...
   * logger.timing('form-validation', performance.now() - start);
   */
  timing: (operation, duration, metadata) => {
    const timingData = {
      operation,
      duration,
      ...metadata,
    };

    if (isDevelopment() && !isTest()) {
      // eslint-disable-next-line no-console
      console.log(`[TIMING] ${operation}: ${duration}ms`, metadata || '');
    }

    sendToMonitoring('timing', `Performance: ${operation}`, timingData);
  },

  /**
   * Analytics event logger - logs user interaction events
   * @param {string} category - Event category
   * @param {string} action - Event action
   * @param {string} [label] - Event label
   * @param {number} [value] - Event value
   * @example
   * logger.event('form', 'field-error', 'ssn', 1);
   */
  event: (category, action, label, value) => {
    const eventData = {
      category,
      action,
      label,
      value,
    };

    if (isDevelopment() && !isTest()) {
      // eslint-disable-next-line no-console
      console.log('[EVENT]', eventData);
    }

    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'custom-event',
        eventCategory: category,
        eventAction: action,
        eventLabel: label,
        eventValue: value,
      });
    }
  },

  /**
   * Creates a child logger with a specific context prefix
   * @param {string} context - Context prefix for all log messages
   * @returns {Object} Child logger with the same methods but prefixed messages
   * @example
   * const formLogger = logger.withContext('BurialFlagsForm');
   * formLogger.debug('Validation started'); // Outputs: [DEBUG] [BurialFlagsForm] Validation started
   */
  withContext: context => {
    return {
      debug: (message, data) => logger.debug(`[${context}] ${message}`, data),
      info: (message, data) => logger.info(`[${context}] ${message}`, data),
      warn: (message, data) => logger.warn(`[${context}] ${message}`, data),
      error: (message, error) => logger.error(`[${context}] ${message}`, error),
      timing: (operation, duration, metadata) =>
        logger.timing(`${context}.${operation}`, duration, metadata),
      event: (category, action, label, value) =>
        logger.event(`${context}.${category}`, action, label, value),
    };
  },
};
