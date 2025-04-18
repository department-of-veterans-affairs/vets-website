import { datadogLogs } from '@datadog/browser-logs';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const DISABLED_ENVIRONMENTS = ['localhost', 'production'];

export const canUseLogging = () => {
  const env = environment.vspEnvironment();

  const alreadyInitialized = Boolean(window.DD_RUM?.getInitConfiguration());
  const inTestEnv = window.Cypress || window.Mocha;
  const inDisabledEnv = DISABLED_ENVIRONMENTS.includes(env);

  return !alreadyInitialized && !inTestEnv && !inDisabledEnv;
};

// https://docs.datadoghq.com/logs/log_collection/javascript/?tab=us#configuration
const defaultLogSettings = {
  // Custom settings
  // applicationId: '{UUID}',
  // clientToken: 'pubb{ID}',
  // service: 'benefits-{app name}',
  // version: '1.0.0',

  // default settings
  site: 'ddog-gov.com',
  // see src/site/constants/vsp-environments.js for defaults
  env: environment.vspEnvironment(), // 'production'
  sessionSampleRate: environment.vspEnvironment() === 'staging' ? 100 : 10,
  forwardErrorsToLogs: true,
  forwardConsoleLogs: ['error'],
  forwardReports: [],
  telemetrySampleRate: environment.vspEnvironment() === 'staging' ? 100 : 20, // default 20
};

export default function initializeBrowserLogging(customLogSettings) {
  // This should only be set to `true` to enable browser logging locally
  // Otherwise this should be `false`
  const overrideChecks = false;

  const useLogging = canUseLogging() && overrideChecks;

  if (useLogging) {
    datadogLogs.init({
      ...defaultLogSettings,
      ...customLogSettings,
    });
  }
}
