import { datadogLogs } from '@datadog/browser-logs';

// Conditional added to prevent initialization of Datadog as it was causing tests to hang indefinitely and prevented coverage report generation
if (!process.env.NODE_ENV === 'test') {
  // Initialize Datadog logging
  datadogLogs.init({
    clientToken: 'pubf64b43174e3eb74fa640b1ec28781c07', // Replace with your Datadog API key
    site: 'ddog-gov.com',
    forwardErrorsToLogs: true, // Automatically capture unhandled errors
    sampleRate: 100, // Percentage of sessions to log (adjust as needed)
  });

  // Add a global context attribute to identify the source of the logs as the chatbot
  datadogLogs.addLoggerGlobalContext('source', 'chatbot');
}

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
