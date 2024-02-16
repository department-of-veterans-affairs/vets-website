import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

// https://docs.datadoghq.com/real_user_monitoring/browser/#configuration
const defaultRumSettings = {
  // Custom settings
  // applicationId: '{UUID}',
  // clientToken: 'pubb{ID}',
  // service: 'benefits-{app name}',
  // version: '1.0.0',

  // Default settings
  site: 'ddog-gov.com',
  // see src/site/constants/vsp-environments.js for defaults
  env: environment.vspEnvironment(), // 'production'
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackInteractions: true,
  trackUserInteractions: true,
  trackFrustrations: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
};

// Initialize Datadog RUM directly, if not using a feature flag
// Don't call this function if not logged in
const initializeRealUserMonitoring = customRumSettings => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.
  if (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration()
  ) {
    datadogRum.init({
      ...defaultRumSettings,
      ...customRumSettings,
    });

    // If sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();
  }
};

// https://docs.datadoghq.com/logs/log_collection/javascript/?tab=us#configuration
const defaultLogSettings = {
  // Custom settings
  // applicationId: '{UUID}',
  // clientToken: 'pubb{ID}',
  // service: 'benefits-{app name}',
  // version: '1.0.0',

  // default settings
  site: 'ddog-gov.com',
  // see src/site/constants/vsp-environments.js for defaults
  env: environment.vspEnvironment(), // 'production'
  sessionSampleRate: 100,
  forwardErrorsToLogs: true,
  forwardConsoleLogs: ['error'],
  forwardReports: [],
  telemetrySampleRate: 20, // default
};

const initializeBrowserLogging = customLogSettings => {
  if (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_LOGS?.getInitConfiguration()
  ) {
    datadogLogs.init({
      ...defaultLogSettings,
      ...customLogSettings,
    });
  }
};

// Initialize Datadog RUM behind feature flag
const useBrowserMonitoring = ({ loggedIn, formId, ...settings }) => {
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const isLoadingFeatureFlags = useToggleLoadingValue();
  const isBrowserMonitoringEnabled = useToggleValue(
    TOGGLE_NAMES[`${formId}BrowserMonitoringEnabled`],
  );

  useEffect(
    () => {
      if (!loggedIn || isLoadingFeatureFlags) {
        return;
      }
      if (isBrowserMonitoringEnabled) {
        initializeRealUserMonitoring(settings);
        initializeBrowserLogging(settings);
      } else {
        delete window.DD_RUM;
        delete window.DD_LOGS;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn, isBrowserMonitoringEnabled, isLoadingFeatureFlags],
  );
};

export { useBrowserMonitoring, initializeRealUserMonitoring };
