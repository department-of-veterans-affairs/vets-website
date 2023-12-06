import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

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
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackInteractions: true,
  trackUserInteractions: true,
  trackFrustrations: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
};

// Initialize Datadog RUM directly, if not using a feature flag
// Don't call this function if not logged in
const initializeRealUserMonitoring = customRumSettings => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.
  if (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration()
  ) {
    datadogRum.init({
      ...defaultRumSettings,
      ...customRumSettings,
    });

    // If sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();
  }
};

// Initialize Datadog RUM behind feature flag
const useBrowserMonitoring = ({ loggedIn, formId, ...settings }) => {
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const isLoadingFeatureFlags = useToggleLoadingValue();
  const isBrowserMonitoringEnabled = useToggleValue(
    TOGGLE_NAMES[`${formId}BrowserMonitoringEnabled`],
  );

  useEffect(
    () => {
      if (!loggedIn || isLoadingFeatureFlags) {
        return;
      }
      if (isBrowserMonitoringEnabled) {
        initializeRealUserMonitoring(settings);
      } else {
        delete window.DD_RUM;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn, isBrowserMonitoringEnabled, isLoadingFeatureFlags],
  );
};

export { useBrowserMonitoring, initializeRealUserMonitoring };
