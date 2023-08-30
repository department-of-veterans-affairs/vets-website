import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const initializeDatadogRum = () => {
  if (
    // Prevent RUM from running on local/CI environments.
    !environment.isLocalhost() &&
    // Prevent re-initializing the SDK.
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  ) {
    datadogRum.init({
      applicationId: '04496177-4c70-4caf-9d1e-de7087d1d296',
      clientToken: 'pubf11b8d8bfe126a01d84e01c177a90ad3',
      site: 'ddog-gov.com',
      service: 'va.gov-mhv-medical-records',
      env: environment.vspEnvironment(),
      sessionSampleRate: 100, // controls the percentage of overall sessions being tracked
      sessionReplaySampleRate: 50, // is applied after the overall sample rate, and controls the percentage of sessions tracked as Browser RUM & Session Replay
      trackInteractions: true,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    });
    datadogRum.startSessionReplayRecording();
  }
};

const useDatadogRum = () => {
  useEffect(() => {
    initializeDatadogRum();
  }, []);
};

export { useDatadogRum };
