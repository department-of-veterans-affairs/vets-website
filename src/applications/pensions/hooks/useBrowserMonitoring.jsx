import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

const APP_UUID = 'b3319250-eeb3-419c-b596-3422aec52e4d';
const APP_DASHBOARD_NAME = 'benefits-pension';
const TOKEN_ID = 'pubd03b9c29b16b25a9fa3ba5cbe8670658';

const initializeRealUserMonitoring = () => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.
  if (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration()
  ) {
    datadogRum.init({
      applicationId: `${APP_UUID}`,
      clientToken: `${TOKEN_ID}`,
      site: 'ddog-gov.com',
      service: `${APP_DASHBOARD_NAME}`,
      env: environment.vspEnvironment(),
      version: '1.0.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    });

    // If sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();
  }
};

const useBrowserMonitoring = () => {
  // Retrieve feature flag values to control behavior
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const isLoadingFeatureFlags = useToggleLoadingValue();
  const isBrowserMonitoringEnabled = useToggleValue(
    TOGGLE_NAMES.pensionsBrowserMonitoringEnabled,
  );

  useEffect(
    () => {
      if (isLoadingFeatureFlags) return;
      if (isBrowserMonitoringEnabled) {
        initializeRealUserMonitoring();
      } else {
        delete window.DD_RUM;
      }
    },
    [isBrowserMonitoringEnabled, isLoadingFeatureFlags],
  );
};

export { useBrowserMonitoring };
