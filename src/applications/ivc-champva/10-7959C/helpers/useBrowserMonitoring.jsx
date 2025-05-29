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
      applicationId: '3e211ba8-dbcd-4a8d-b3eb-18950d5a46bc',
      clientToken: 'pub383f4e654ef2030cd6045c8532593afc',
      site: 'ddog-gov.com',
      service: 'ivc-ohi-10-7959c',
      env: environment.vspEnvironment(),
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
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
