import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';

import { isProfileLoading } from '@department-of-veterans-affairs/platform-user/selectors';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { selectFeatureToggles } from '../utils/selectors/feature-toggles';
import { selectRumUser } from '../utils/selectors/datadog-rum';

const initializeRealUserMonitoring = user => {
  // Prevent RUM from running on local/CI environments
  if (environment.BASE_URL.includes('localhost')) return;

  // Prevent RUM from re-initializing the SDK
  if (!window.DD_RUM?.getInitConfiguration()) {
    datadogRum.init({
      applicationId: '9d5155fd-8623-4bc9-8580-ad8ec2cdd7fa',
      clientToken: 'pub20bf1f8aaef56d8c0100b0a65601a702',
      site: 'ddog-gov.com',
      service: '10-10ez',
      env: environment.vspEnvironment(),
      sampleRate: 100,
      sessionReplaySampleRate: 1,
      trackInteractions: true,
      trackFrustrations: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask',
    });

    // if sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();
  }

  // set additional user properties
  const userProps = Object.entries(user);
  userProps.forEach(([key, val]) => {
    datadogRum.setUserProperty(key, val);
  });
};

const useBrowserMonitoring = () => {
  // Retrieve feature flag values to control behavior
  const featureToggles = useSelector(selectFeatureToggles);
  const isLoadingUserProfile = useSelector(isProfileLoading);
  const userProps = useSelector(selectRumUser);
  const { isBrowserMonitoringEnabled, isLoadingFeatureFlags } = featureToggles;

  useEffect(
    () => {
      if (isLoadingFeatureFlags || isLoadingUserProfile) return;
      if (isBrowserMonitoringEnabled) {
        initializeRealUserMonitoring(userProps);
      } else {
        delete window.DD_RUM;
      }
    },
    [
      isBrowserMonitoringEnabled,
      isLoadingFeatureFlags,
      isLoadingUserProfile,
      userProps,
    ],
  );
};

export { useBrowserMonitoring };
