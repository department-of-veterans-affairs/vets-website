import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { selectFeatureToggles } from '../utils/selectors';

// declare shared config between Logs and RUM
const DEFAULT_CONFIG = {
  clientToken: 'pub70168626b5b3bf45d38f686506b60915',
  site: 'ddog-gov.com',
  service: '10-10cg',
  env: environment.vspEnvironment(),
  sessionSampleRate: 100,
};

const initializeRealUserMonitoring = () => {
  // prevent RUM from re-initializing the SDK
  if (!window.DD_RUM?.getInitConfiguration()) {
    datadogRum.init({
      ...DEFAULT_CONFIG,
      applicationId: '0dce7846-1a1f-4509-a0d9-d689d453151f',
      sessionReplaySampleRate: 100,
      trackUserInteractions: true,
      trackFrustrations: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    });

    // if sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();
  }
};

const intitalizeBrowserLogging = () => {
  // prevent LOGS from re-initializing the SDK
  if (!window.DD_LOGS?.getInitConfiguration()) {
    datadogLogs.init({
      ...DEFAULT_CONFIG,
      forwardErrorsToLogs: true,
    });
  }
};

const useBrowserMonitoring = () => {
  const featureToggles = useSelector(selectFeatureToggles);
  const { isBrowserMonitoringEnabled, isLoadingFeatureFlags } = featureToggles;

  useEffect(() => {
    if (isLoadingFeatureFlags) return;
    if (!environment.BASE_URL.includes('localhost')) return;

    // enable browser logging
    intitalizeBrowserLogging();

    // enable RUM if feature flag value is `true`
    if (isBrowserMonitoringEnabled) {
      initializeRealUserMonitoring();
    } else {
      delete window.DD_RUM;
    }
  }, [isBrowserMonitoringEnabled, isLoadingFeatureFlags]);
};

export { useBrowserMonitoring };
