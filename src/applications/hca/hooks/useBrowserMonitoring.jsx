import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import environment from 'platform/utilities/environment';
import { isProfileLoading } from 'platform/user/selectors';
import { selectFeatureToggles, selectRumUser } from '../utils/selectors';

// declare shared config between Logs and RUM
const DEFAULT_CONFIG = {
  clientToken: 'pub20bf1f8aaef56d8c0100b0a65601a702',
  site: 'ddog-gov.com',
  service: '10-10ez',
  env: environment.vspEnvironment(),
  sessionSampleRate: 100,
};

// declare 3rd party domains to exclude from logs
const EXCLUDED_DOMAINS = [
  'resource.digital.voice.va.gov',
  'browser-intake-ddog-gov.com',
  'google-analytics.com',
  'eauth.va.gov',
  'api.va.gov',
];

const initializeRealUserMonitoring = user => {
  // prevent RUM from re-initializing the SDK
  if (!window.DD_RUM?.getInitConfiguration()) {
    datadogRum.init({
      ...DEFAULT_CONFIG,
      applicationId: '9d5155fd-8623-4bc9-8580-ad8ec2cdd7fa',
      sessionReplaySampleRate: 100,
      trackUserInteractions: true,
      trackFrustrations: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
      beforeSend: ({ type, resource }) => {
        return !(
          type === 'resource' &&
          EXCLUDED_DOMAINS.some(domain => resource.url.includes(domain))
        );
      },
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

const initializeBrowserLogging = () => {
  // prevent LOGS from re-initializing the SDK
  if (!window.DD_LOGS?.getInitConfiguration()) {
    datadogLogs.init({
      ...DEFAULT_CONFIG,
      forwardErrorsToLogs: true,
      beforeSend: ({ http }) => {
        return !(
          http?.url &&
          EXCLUDED_DOMAINS.some(domain => http.url.includes(domain))
        );
      },
    });
  }
};

const useBrowserMonitoring = () => {
  const featureToggles = useSelector(selectFeatureToggles);
  const isLoadingUserProfile = useSelector(isProfileLoading);
  const userProps = useSelector(selectRumUser);
  const { isBrowserMonitoringEnabled, isLoadingFeatureFlags } = featureToggles;

  useEffect(
    () => {
      if (isLoadingFeatureFlags || isLoadingUserProfile) return;
      if (environment.BASE_URL.includes('localhost')) return;

      // enable browser logging
      initializeBrowserLogging();

      // enable RUM if feature flag value is `true`
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
