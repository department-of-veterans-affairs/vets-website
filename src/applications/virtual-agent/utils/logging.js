import logger from './logger';

/**
 * Logs an error to Datadog if the logging feature toggle is enabled.
 * @param {Error|string} message - The error message or object to log.
 * @param {Object} [context] - Additional context to log (optional).
 */
export function logErrorToDatadog(
  isDatadogLoggingEnabled,
  message,
  context = {},
) {
  if (isDatadogLoggingEnabled) {
    logger.error(message, context);
  }
}
