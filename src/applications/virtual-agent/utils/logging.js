import { datadogLogs } from '@datadog/browser-logs';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

// Conditional added to prevent initialization of Datadog as it was causing tests to hang indefinitely and prevented coverage report generation
if (!process.env.NODE_ENV === 'test') {
  // Initialize Datadog logging
  datadogLogs.init({
    clientToken: 'pubf64b43174e3eb74fa640b1ec28781c07',
    service: 'virtual-agent-front-end',
    team: 'virtual-agent-platform',
    site: 'ddog-gov.com',
    env: environment.vspEnvironment(),
    sessionSampleRate: 100,
    forwardConsoleLogs: ['error'],
    telemetrySampleRate: 100,
  });
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
    datadogLogs.logger.error(message, context);
  }
}
