/**
 * Logging utility for benefits-optimization-aquia applications.
 * Only logs in local development (NODE_ENV === 'development').
 * All console output and monitoring is disabled in production, staging, and test.
 *
 * To enable logs in tests for debugging: ENABLE_TEST_LOGS=true yarn test:unit
 *
 * @module logger
 */

/**
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
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ${message}`, data !== undefined ? data : '');
    }
  },

  /**
   * @param {string} message
   * @param {*} [data]
   */
  info: (message, data) => {
    if (shouldLog()) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, data !== undefined ? data : '');
    }
    sendToMonitoring('info', message, data);
  },

  /**
   * @param {string} message
   * @param {*} [data]
   */
  warn: (message, data) => {
    if (shouldLog()) {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, data !== undefined ? data : '');
    }
    sendToMonitoring('warn', message, data);
  },

  /**
   * @param {string} message
   * @param {Error|*} [error]
   */
  error: (message, error) => {
    if (shouldLog()) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, error !== undefined ? error : '');
    }

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
   * @param {string} operation
   * @param {number} duration - Milliseconds
   * @param {*} [metadata]
   */
  timing: (operation, duration, metadata) => {
    const timingData = {
      operation,
      duration,
      ...metadata,
    };

    if (shouldLog()) {
      // eslint-disable-next-line no-console
      console.log(`[TIMING] ${operation}: ${duration}ms`, metadata || '');
    }

    sendToMonitoring('timing', `Performance: ${operation}`, timingData);
  },

  /**
   * @param {string} category
   * @param {string} action
   * @param {string} [label]
   * @param {number} [value]
   */
  event: (category, action, label, value) => {
    if (!shouldLog()) {
      return;
    }

    const eventData = {
      category,
      action,
      label,
      value,
    };

    // eslint-disable-next-line no-console
    console.log('[EVENT]', eventData);

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
   * Creates a scoped logger with context prefix
   * @param {string} context
   * @returns {Object} Logger with same methods but prefixed output
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
