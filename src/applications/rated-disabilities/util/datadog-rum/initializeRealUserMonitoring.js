import { datadogRum } from '@datadog/browser-rum';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const DISABLED_ENVIRONMENTS = ['localhost'];

export const canUseRUM = () => {
  const env = environment.vspEnvironment();

  const alreadyInitialized = Boolean(window.DD_RUM?.getInitConfiguration());
  const inTestEnv = window.Cypress || window.Mocha;
  const inDisabledEnv = DISABLED_ENVIRONMENTS.includes(env);

  return !alreadyInitialized && !inTestEnv && !inDisabledEnv;
};

// https://docs.datadoghq.com/real_user_monitoring/browser/#configuration
const defaultRumSettings = {
  // Custom settings
  // applicationId: '{UUID}',
  // clientToken: 'pubb{ID}',
  // service: 'benefits-{app name}',
  // version: '1.0.0',

  // Default settings
  site: 'ddog-gov.com',
  // see src/site/constants/vsp-environments.js for defaults
  env: environment.vspEnvironment(), // 'production'
  sessionSampleRate: 10,
  sessionReplaySampleRate: 20,
  trackInteractions: true,
  trackUserInteractions: true,
  trackFrustrations: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
};

// Initialize Datadog RUM directly, if not using a feature flag
// Don't call this function if not logged in
export default function initializeRealUserMonitoring(customRumSettings) {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.

  // This should only be set to `true` to enable RUM locally
  // Otherwise this should be `false`
  const overrideChecks = false;
  const useRUM = canUseRUM() || overrideChecks;

  if (useRUM) {
    datadogRum.init({
      ...defaultRumSettings,
      ...customRumSettings,
    });

    // If sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();
  }
}
