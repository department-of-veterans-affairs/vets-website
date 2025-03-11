import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { makeSelectFeatureToggles } from '../selectors/feature-toggles';

const initializeRealUserMonitoring = () => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.
  if (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration()
  ) {
    datadogRum.init({
      applicationId: 'cca24a05-9ea0-49ea-aaa9-0d1e04a17ba0',
      clientToken: 'puba5e0866f8008f60a6bc8b09ae555dd92',
      site: 'ddog-gov.com',
      service: '10-10d',
      env: environment.vspEnvironment(),
      sessionSampleRate: 100,
      sessionReplaySampleRate: 100,
      trackUserInteractions: true,
      trackFrustrations: true,
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
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isBrowserMonitoringEnabled, isLoadingFeatureFlags } = featureToggles;

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
