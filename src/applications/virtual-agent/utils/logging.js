import { datadogLogs } from '@datadog/browser-logs';

// Initialize Datadog logging
datadogLogs.init({
  clientToken: 'YOUR_DATADOG_CLIENT_TOKEN', // Replace with your Datadog API key
  site: 'datadoghq.com',
  forwardErrorsToLogs: true, // Automatically capture unhandled errors
  sampleRate: 100, // Percentage of sessions to log (adjust as needed)
});

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
    // Replace with your actual feature toggle name
    datadogLogs.logger.error(message, context);
  }
}
