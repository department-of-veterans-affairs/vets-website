import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

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

// Initialize Datadog RUM directly
// Don't call this function if not logged in
const initializeRealUserMonitoring = customRumSettings => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.
  if (
    process.env.NODE_ENV !== 'test' &&
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration()
  ) {
    datadogRum.init({
      ...defaultRumSettings,
      ...customRumSettings,
    });

    // If sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();

    datadogRum.setUserProperty({
      userUuid: customRumSettings?.userUuid || null,
    });
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
  telemetrySampleRate: 100, // default 20
};

const initializeBrowserLogging = customLogSettings => {
  if (
    process.env.NODE_ENV !== 'test' &&
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_LOGS?.getInitConfiguration()
  ) {
    datadogLogs.init({
      ...defaultLogSettings,
      ...customLogSettings,
    });
  }
};

const useBrowserMonitoring = ({ loggedIn, ...settings }) => {
  useEffect(
    () => {
      if (!loggedIn) {
        return;
      }

      initializeRealUserMonitoring(settings);
      initializeBrowserLogging(settings);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn],
  );
};

export { useBrowserMonitoring, initializeRealUserMonitoring };
