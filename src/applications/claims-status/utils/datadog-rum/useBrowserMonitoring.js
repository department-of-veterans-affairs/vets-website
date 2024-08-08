import { useEffect } from 'react';
import { datadogLogs } from '@datadog/browser-logs';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { initializeRealUserMonitoring } from './initializeRealUserMonitoring';

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
  sessionSampleRate: environment.vspEnvironment() === 'staging' ? 100 : 5,
  forwardErrorsToLogs: true,
  forwardConsoleLogs: ['error'],
  forwardReports: [],
  telemetrySampleRate: environment.vspEnvironment() === 'staging' ? 100 : 20, // default 20
};

const initializeBrowserLogging = customLogSettings => {
  if (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_LOGS?.getInitConfiguration() &&
    !window.Mocha
  ) {
    datadogLogs.init({
      ...defaultLogSettings,
      ...customLogSettings,
    });
  }
};

// Initialize Datadog RUM behind feature flag
export const useBrowserMonitoring = ({ loggedIn, ...settings }) => {
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const isLoadingFeatureFlags = useToggleLoadingValue();
  const isBrowserMonitoringEnabled = useToggleValue(
    TOGGLE_NAMES.cstUseDataDogRUM,
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
