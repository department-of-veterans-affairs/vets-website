/**
<<<<<<< HEAD
 * Logging utility for benefits-optimization-aquia applications.
 * Only logs in local development (NODE_ENV === 'development').
 * All console output and monitoring is disabled in production, staging, and test.
 *
 * To enable logs in tests for debugging: ENABLE_TEST_LOGS=true yarn test:unit
=======
 * Centralized logging utility for the Share Utility.
 * Provides environment-aware logging with support for different log levels
 * and integration with monitoring services.
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
 *
 * @module logger
 */

/**
<<<<<<< HEAD
 * Determines if logging should be enabled based on environment
 * @returns {boolean} True if should log to console
 */
const shouldLog = () => {
  if (typeof process === 'undefined' || !process.env) {
    return false;
  }

  const env = process.env.NODE_ENV;

  // Always log in development
  if (env === 'development') return true;

  // Log in test only if explicitly enabled
  if (env === 'test' && process.env.ENABLE_TEST_LOGS === 'true') return true;

  // Never log in production or other environments
  return false;
};

/**
 * @param {*} data
 * @returns {string} JSON string or fallback representation
=======
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
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
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
<<<<<<< HEAD

=======
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
  return String(data);
};

/**
<<<<<<< HEAD
 * Sends data to window.dataLayer for monitoring (development only)
 * @param {string} level
 * @param {string} message
 * @param {*} data
 * @private
 */
const sendToMonitoring = (level, message, data) => {
  if (!shouldLog()) {
    return;
  }

=======
 * Sends error data to monitoring service (e.g., Sentry, DataDog)
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {*} data - Additional data
 * @private
 */
const sendToMonitoring = (level, message, data) => {
  // Integration point for monitoring services
  // This would be implemented based on the specific monitoring service used
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
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
<<<<<<< HEAD
 * Logger with methods for different log levels.
 * All methods are no-ops unless NODE_ENV === 'development'.
 */
export const logger = {
  /**
   * @param {string} message
   * @param {*} [data]
   */
  debug: (message, data) => {
    if (shouldLog()) {
=======
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
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ${message}`, data !== undefined ? data : '');
    }
  },

  /**
<<<<<<< HEAD
   * @param {string} message
   * @param {*} [data]
   */
  info: (message, data) => {
    if (shouldLog()) {
=======
   * Info level logging - outputs in development and production
   * @param {string} message - Info message
   * @param {*} [data] - Optional data to log
   * @example
   * logger.info('Form submitted successfully', { formId: 'BURIAL_FLAGS' });
   */
  info: (message, data) => {
    if (!isTest()) {
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, data !== undefined ? data : '');
    }
    sendToMonitoring('info', message, data);
  },

  /**
<<<<<<< HEAD
   * @param {string} message
   * @param {*} [data]
   */
  warn: (message, data) => {
    if (shouldLog()) {
=======
   * Warning level logging - outputs in all environments
   * @param {string} message - Warning message
   * @param {*} [data] - Optional data to log
   * @example
   * logger.warn('Validation warning', { field: 'ssn', issue: 'format' });
   */
  warn: (message, data) => {
    if (!isTest()) {
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, data !== undefined ? data : '');
    }
    sendToMonitoring('warn', message, data);
  },

  /**
<<<<<<< HEAD
   * @param {string} message
   * @param {Error|*} [error]
   */
  error: (message, error) => {
    if (shouldLog()) {
=======
   * Error level logging - outputs in all environments
   * @param {string} message - Error message
   * @param {Error|*} [error] - Error object or additional data
   * @example
   * logger.error('Form submission failed', error);
   */
  error: (message, error) => {
    if (!isTest()) {
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, error !== undefined ? error : '');
    }

<<<<<<< HEAD
=======
    // Extract error details for monitoring
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
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
<<<<<<< HEAD
   * @param {string} operation
   * @param {number} duration - Milliseconds
   * @param {*} [metadata]
=======
   * Performance timing logger - logs timing data for performance monitoring
   * @param {string} operation - Operation being timed
   * @param {number} duration - Duration in milliseconds
   * @param {*} [metadata] - Additional metadata
   * @example
   * const start = performance.now();
   * // ... operation ...
   * logger.timing('form-validation', performance.now() - start);
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
   */
  timing: (operation, duration, metadata) => {
    const timingData = {
      operation,
      duration,
      ...metadata,
    };

<<<<<<< HEAD
    if (shouldLog()) {
=======
    if (isDevelopment() && !isTest()) {
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
      // eslint-disable-next-line no-console
      console.log(`[TIMING] ${operation}: ${duration}ms`, metadata || '');
    }

    sendToMonitoring('timing', `Performance: ${operation}`, timingData);
  },

  /**
<<<<<<< HEAD
   * @param {string} category
   * @param {string} action
   * @param {string} [label]
   * @param {number} [value]
   */
  event: (category, action, label, value) => {
    if (!shouldLog()) {
      return;
    }

=======
   * Analytics event logger - logs user interaction events
   * @param {string} category - Event category
   * @param {string} action - Event action
   * @param {string} [label] - Event label
   * @param {number} [value] - Event value
   * @example
   * logger.event('form', 'field-error', 'ssn', 1);
   */
  event: (category, action, label, value) => {
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
    const eventData = {
      category,
      action,
      label,
      value,
    };

<<<<<<< HEAD
    // eslint-disable-next-line no-console
    console.log('[EVENT]', eventData);
=======
    if (isDevelopment() && !isTest()) {
      // eslint-disable-next-line no-console
      console.log('[EVENT]', eventData);
    }
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

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
<<<<<<< HEAD
   * Creates a scoped logger with context prefix
   * @param {string} context
   * @returns {Object} Logger with same methods but prefixed output
=======
   * Creates a child logger with a specific context prefix
   * @param {string} context - Context prefix for all log messages
   * @returns {Object} Child logger with the same methods but prefixed messages
   * @example
   * const formLogger = logger.withContext('BurialFlagsForm');
   * formLogger.debug('Validation started'); // Outputs: [DEBUG] [BurialFlagsForm] Validation started
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
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
