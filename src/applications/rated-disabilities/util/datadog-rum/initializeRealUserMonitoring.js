import { datadogRum } from '@datadog/browser-rum';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

// This is used in useDataDogRum
// Note: Blocking production usage for now until we can QA in Staging
export const isProductionEnv = () => {
  return (
    // !environment.BASE_URL.includes('localhost') &&
    // TODO: remove this when we push to production
    environment.vspEnvironment() !== 'production' &&
    // !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  );
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
export const initializeRealUserMonitoring = customRumSettings => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.

  if (isProductionEnv()) {
    datadogRum.init({
      ...defaultRumSettings,
      ...customRumSettings,
    });

    // If sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();
  }
};
