import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import environment from '~/platform/utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

// Configuration constants
const CONFIG = {
  applicationId: '7909bc8f-3e73-43b4-b01c-e0de92ccbe85',
  clientToken: 'pub1e95c062768737937070fea457e175e2',
  site: 'ddog-gov.com',
  service: 'my-va',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 5,
  trackBfcacheViews: true,
  defaultPrivacyLevel: 'mask-user-input',
};

const initializeRealUserMonitoring = () => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.
  // We only want this in staging/production typically.
  if (!environment.isLocalhost() && !window.DD_RUM?.getInitConfiguration()) {
    datadogRum.init({
      ...CONFIG,
      env: environment.vspEnvironment(),
    });

    if (CONFIG.sessionReplaySampleRate > 0) {
      datadogRum.startSessionReplayRecording();
    }
  }
};

export const useBrowserMonitoring = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const isMonitoringEnabled = useToggleValue(
    TOGGLE_NAMES.myVaBrowserMonitoring,
  );

  useEffect(
    () => {
      if (isMonitoringEnabled) {
        initializeRealUserMonitoring();
      }

      return () => {
        delete window.DD_RUM;
      };
    },
    [isMonitoringEnabled],
  );
};
