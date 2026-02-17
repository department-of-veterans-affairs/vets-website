import { useEffect, useRef } from 'react';
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
  sessionReplaySampleRate: 1,
  trackBfcacheViews: true,
  trackUserInteractions: true,
  defaultPrivacyLevel: 'mask-user-input',
};

const initializeRealUserMonitoring = () => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.
  if (environment.isLocalhost()) {
    return false;
  }

  // If RUM is already running from another app, stop and delete it
  if (window.DD_RUM?.getInitConfiguration()) {
    datadogRum.stopSession();
    delete window.DD_RUM;
  }

  datadogRum.init({
    ...CONFIG,
    env: environment.vspEnvironment(),
  });

  if (CONFIG.sessionReplaySampleRate > 0) {
    datadogRum.startSessionReplayRecording();
  }
  return true;
};

export const useBrowserMonitoring = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const initializedByMyVA = useRef(false);

  const isMonitoringEnabled = useToggleValue(
    TOGGLE_NAMES.myVaBrowserMonitoring,
  );

  useEffect(() => {
    if (isMonitoringEnabled) {
      initializedByMyVA.current = initializeRealUserMonitoring();
    }

    return () => {
      if (initializedByMyVA.current && window.DD_RUM?.getInitConfiguration()) {
        datadogRum.stopSession();
        delete window.DD_RUM;
      }
    };
  }, [isMonitoringEnabled]);
};
