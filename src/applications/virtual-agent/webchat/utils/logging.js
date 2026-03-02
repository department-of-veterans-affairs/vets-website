import { datadogLogs } from '@datadog/browser-logs';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { initializeBrowserLogging } from 'platform/monitoring/Datadog';

const APP_ID = 'ad327652-564b-4537-91c7-328eb90f77ed';
const CLIENT_TOKEN = 'pubf64b43174e3eb74fa640b1ec28781c07';

/**
 * Initializes logging for the application.
 * @returns {void}
 */
export const initLogging = () =>
  initializeBrowserLogging({
    clientToken: CLIENT_TOKEN,
    applicationId: APP_ID,
    service: 'virtual-agent-front-end',
    site: 'ddog-gov.com',
    env: environment.vspEnvironment(),
    sessionSampleRate: 100,
    forwardConsoleLogs: ['error'],
    telemetrySampleRate: 100,
    forwardErrorsToLogs: true,
    forwardReports: [],
    sampleRate: 100,
    version: '1.0.0',
  });

/**
 * Logs an error to Datadog if the logging feature toggle is enabled.
 * @param {boolean} isDatadogLoggingEnabled - Flag indicating if Datadog logging is enabled.
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
