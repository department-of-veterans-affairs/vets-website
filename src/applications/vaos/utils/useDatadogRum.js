import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from 'platform/utilities/environment';

const initializeDatadogRum = () => {
  if (
    // Prevent RUM from running on local/CI environments.
    environment.BASE_URL.indexOf('localhost') < 0 &&
    // Prevent re-initializing the SDK.
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  ) {
    datadogRum.init({
      applicationId: 'fa7a1075-965f-484d-b812-6f10f4572694',
      clientToken: 'pub4705a09a8da66995fa85908096f42321',
      site: 'ddog-gov.com',
      service: 'va.gov-appointments',
      env: environment.vspEnvironment(),
      sessionSampleRate: 100,
      sessionReplaySampleRate: 10,
      trackInteractions: true,
      trackFrustrations: true,
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
