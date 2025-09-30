import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import { isBot, canInitDatadog, dataDogLogger } from './utilities';

/**
 * @typedef {Object} CustomRumSettings https://docs.datadoghq.com/real_user_monitoring/browser/setup/client/?tab=rum#initialization-parameters
 * @property {string} applicationId - Datadog application ID
 * @property {string} clientToken - Datadog client token
 * @property {string} defaultPrivacyLevel - Default privacy level
 * @property {string} env - Environment name (default: 'production')
 * @property {string} service - Datadog service name
 * @property {number} sessionSampleRate - Sample rate for sessions
 * @property {number} sessionReplaySampleRate - Sample rate for session replay
 * @property {string} site - Datadog site (default: 'ddog-gov.com')
 * @property {boolean} trackInteractions - Whether to track user interactions
 * @property {boolean} trackUserInteractions - Whether to track user interactions
 * @property {boolean} trackFrustrations - Whether to track user frustrations
 * @property {boolean} trackResources - Whether to track resources
 * @property {boolean} trackLongTasks - Whether to track long tasks
 * @property {string} version - Datadog version
 */
/**
 * Initialize Datadog RUM directly, if not using a feature flag
 * @param {CustomRumSettings} customRumSettings
 */
const initializeRealUserMonitoring = (
  customRumSettings,
  checkInit = canInitDatadog,
) => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI
  // environments.
  if (checkInit()) {
    datadogRum.init({
      // Required settings
      // applicationId: '{UUID}',
      // clientToken: 'pubb{ID}',
      // service: 'benefits-{app name}',
      // version: '1.0.0',

      // Default settings
      site: 'ddog-gov.com',
      // see src/site/constants/vsp-environments.js for defaults
      defaultPrivacyLevel: 'mask-user-input',
      enablePrivacyForActionName: true,
      env: environment.vspEnvironment(), // 'production'
      sessionReplaySampleRate: 100,
      silentMultipleInit: true, // silently ignore multiple inits
      trackFrustrations: true,
      trackInteractions: true,
      trackLongTasks: true,
      trackResources: true,
      trackUserInteractions: true,
      trackViewsManually: false,
      ...(customRumSettings || {}),
    });

    // If sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();
  }
};

/**
 * @typedef {Object} CustomLogSettings https://docs.datadoghq.com/logs/log_collection/javascript/?tab=us#configuration
 * @property {string} applicationId - Datadog application ID
 * @property {string} clientToken - Datadog client token
 * @property {string} env - Environment name
 * @property {boolean} forwardErrorsToLogs - Whether to forward errors to logs
 * @property {Array<string>} forwardConsoleLogs - Console log levels to forward
 * @property {Array<string>} forwardReports - Reports to forward
 * @property {number} sessionSampleRate - Sample rate for sessions
 * @property {string} service - Datadog service name
 * @property {string} site - Datadog site (default: 'ddog-gov.com')
 * @property {number} telemetrySampleRate - Sample rate for telemetry
 * @property {string} version - Datadog version
 */
/**
 * Initialize Datadog RUM directly, if not using a feature flag
 * @param {CustomLogSettings} customLogSettings
 */
const initializeBrowserLogging = (
  customLogSettings,
  checkInit = canInitDatadog,
) => {
  // Prevent LOGS from re-initializing the SDK OR running on local/CI
  // environments.
  if (checkInit()) {
    datadogLogs.init({
      // Required settings
      // applicationId: '{UUID}',
      // clientToken: 'pubb{ID}',
      // service: 'benefits-{app name}',
      // version: '1.0.0',

      // default settings
      site: 'ddog-gov.com',
      // see src/site/constants/vsp-environments.js for defaults
      env: environment.vspEnvironment(), // 'production'
      forwardConsoleLogs: ['error'],
      forwardErrorsToLogs: true,
      forwardReports: [],
      silentMultipleInit: true, // silently ignore multiple inits
      telemetrySampleRate: 100,
      ...(customLogSettings || {}),
    });
  }
};

// Initialize Datadog RUM behind feature flag
const useBrowserMonitoring = ({
  toggleName = '',
  loggedIn,
  checkInit = canInitDatadog,
  ...settings
} = {}) => {
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const isLoadingFeatureFlags = useToggleLoadingValue();
  /* eslint-disable react-hooks/rules-of-hooks */
  const isBrowserMonitoringEnabled = useToggleValue(TOGGLE_NAMES[toggleName]);
  /* eslint-enable react-hooks/rules-of-hooks */

  useEffect(
    () => {
      // Allow RUM for unauthenticated forms; pass in undefined loggedIn
      if (isLoadingFeatureFlags || loggedIn === false) {
        return;
      }
      if (
        !settings.applicationId ||
        !settings.clientToken ||
        !settings.service ||
        !settings.version
      ) {
        // This was originally throwing an error, but difficult to test given that
        // this isn't a React component
        // eslint-disable-next-line no-console
        console.error(
          'Datadog RUM & monitoring initialization requires applicationId, clientToken, service, and version.',
        );
        return;
      }

      // Allows initialization with no feature flag, or if not logged in
      if (toggleName && isBrowserMonitoringEnabled) {
        initializeRealUserMonitoring(settings, checkInit);
        initializeBrowserLogging(settings, checkInit);
      } else {
        delete window.DD_RUM;
        delete window.DD_LOGS;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings, isBrowserMonitoringEnabled, isLoadingFeatureFlags],
  );

  return null;
};

export {
  canInitDatadog,
  initializeBrowserLogging,
  initializeRealUserMonitoring,
  isBot,
  useBrowserMonitoring,
  dataDogLogger,
};
