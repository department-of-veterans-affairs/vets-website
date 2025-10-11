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
      applicationId: process.env.D_DOG_APPLICATION_ID,
      clientToken: process.env.D_DOG_CLIENT_TOKEN,
      site: process.env.D_DOG_SITE_ADDRESS,
      service: '10-10d',
      env: environment.vspEnvironment(),
      sessionSampleRate: 100,
      sessionReplaySampleRate: 100,
      trackUserInteractions: true,
      trackFrustrations: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
      beforeSend: event => {
        // Prevent PII from being sent to Datadog with click actions.
        if (event.action?.type === 'click') {
          // eslint-disable-next-line no-param-reassign
          event.action.target.name = 'CHAMPVA item';
        }
        return true;
      },
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
