import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { makeSelectFeatureToggles } from '../utils/feature-toggles';

const initializeRealUserMonitoring = () => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.
  if (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration()
  ) {
    datadogRum.init({
      applicationId: 'cabce133-7a68-46ba-ac9b-68c57e8375eb',
      clientToken: 'pubb208973905b7f32eb100b1c27688ecc9',
      site: 'ddog-gov.com',
      service: 'benefits-notice-of-disagreement',
      env: environment.vspEnvironment(), // 'vagovprod'
      version: '1.0.0',
      sampleRate: 100,
      sessionReplaySampleRate: 100,
      trackInteractions: true,
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
