import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import { useEffect } from 'react';
import environment from 'platform/utilities/environment';

const defaultDatadogRUMConfig = {
  applicationId: '4fd7481e-66ef-4a89-86d0-84e691ffdfa5',
  clientToken: 'pub02875174418494ddae85287f690d16d6',
  // `site` refers to the Datadog site parameter of your organization
  // see https://docs.datadoghq.com/getting_started/site/
  site: 'ddog-gov.com',
  service: 'discover-your-benefits',
  env: environment.vspEnvironment(),
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackFrustrations: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
};

const defaultDatadogLogConfig = {
  applicationId: '4fd7481e-66ef-4a89-86d0-84e691ffdfa5',
  clientToken: 'pub02875174418494ddae85287f690d16d6',
  // `site` refers to the Datadog site parameter of your organization
  // see https://docs.datadoghq.com/getting_started/site/
  site: 'ddog-gov.com',
  service: 'discover-your-benefits',
  env: environment.vspEnvironment(),
  sessionSampleRate: 100,
  forwardErrorsToLogs: true,
  forwardConsoleLogs: ['error'],
  forwardReports: [],
  telemetrySampleRate: 20, // default 20
};

const initializeDatadogRum = () => {
  if (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration() &&
    environment.isStaging()
  ) {
    datadogRum.init(defaultDatadogRUMConfig);
    datadogRum.startSessionReplayRecording();
  }
};

const initializeBrowserLogging = () => {
  if (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_LOGS?.getInitConfiguration() &&
    environment.isStaging()
  ) {
    datadogLogs.init(defaultDatadogLogConfig);
  }
};

const useDatadogRum = () => {
  useEffect(() => {
    initializeDatadogRum();
    initializeBrowserLogging();
  }, []);
};

export { useDatadogRum };
