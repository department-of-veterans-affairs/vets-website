import { datadogLogs } from '@datadog/browser-logs';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { initializeBrowserLogging } from 'platform/monitoring/Datadog';

// Conditional added to prevent initialization of Datadog as it was causing tests to hang indefinitely and prevented coverage report generation
// OLD call that is now wrapped in an init function
// if (!process.env.NODE_ENV === 'test') {
//   // Initialize Datadog logging
//   datadogLogs.init({
//     clientToken: 'pubf64b43174e3eb74fa640b1ec28781c07',
//     service: 'virtual-agent-front-end',
//     team: 'virtual-agent-platform',
//     site: 'ddog-gov.com',
//     env: environment.vspEnvironment(),
//     sessionSampleRate: 100,
//     forwardConsoleLogs: ['error'],
//     telemetrySampleRate: 100,
//     forwardErrorsToLogs: true,
//     forwardReports: [],
//     sampleRate: 100,
//   });
// }

// example from burials-ez
// const APP_ID = '88a7f64b-7f8c-4e26-bef8-55954cab8973';
const APP_ID = 'still-need-this-app-uuid-thingy';

/**
 * Initializes logging for the application.
 * @returns {void}
 */
export const initLogging = () =>
  initializeBrowserLogging({
    clientToken: 'pubf64b43174e3eb74fa640b1ec28781c07',
    applicationId: APP_ID,
    // team: 'virtual-agent-platform', ????
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

    // or this might be an option to call from the initialized window object
    if (window.DD_LOGS) {
      window.DD_LOGS.logger.error(message, {}, context);
    }
  }
}
