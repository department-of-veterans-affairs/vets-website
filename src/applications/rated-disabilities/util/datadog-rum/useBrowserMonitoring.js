import { useEffect } from 'react';
// import { datadogLogs } from '@datadog/browser-logs';

// import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { initializeRealUserMonitoring } from './initializeRealUserMonitoring';

// https://docs.datadoghq.com/logs/log_collection/javascript/?tab=us#configuration
// const defaultLogSettings = {
//   // Custom settings
//   // applicationId: '{UUID}',
//   // clientToken: 'pubb{ID}',
//   // service: 'benefits-{app name}',
//   // version: '1.0.0',

//   // default settings
//   site: 'ddog-gov.com',
//   // see src/site/constants/vsp-environments.js for defaults
//   env: environment.vspEnvironment(), // 'production'
//   sessionSampleRate: environment.vspEnvironment() === 'staging' ? 100 : 10,
//   forwardErrorsToLogs: true,
//   forwardConsoleLogs: ['error'],
//   forwardReports: [],
//   telemetrySampleRate: environment.vspEnvironment() === 'staging' ? 100 : 20, // default 20
// };

// const initializeBrowserLogging = customLogSettings => {
//   if (
//     !environment.BASE_URL.includes('localhost') &&
//     !window.DD_LOGS?.getInitConfiguration() &&
//     !window.Mocha
//   ) {
//     datadogLogs.init({
//       ...defaultLogSettings,
//       ...customLogSettings,
//     });
//   }
// };

// Initialize Datadog RUM behind feature flag
export const useBrowserMonitoring = ({ loggedIn, ...settings }) => {
  useEffect(
    () => {
      if (!loggedIn) {
        return;
      }

      initializeRealUserMonitoring(settings);
      // TODO: Waiting to enable this until Real User Monitoring has been QA'd
      // initializeBrowserLogging(settings);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn],
  );
};
