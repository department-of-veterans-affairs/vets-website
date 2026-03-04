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
      applicationId: 'b0f350ef-b7c0-4226-a65b-4f0b83a4b630',
      clientToken: 'pub296b1699132775cab51c8d528c50e903',
      site: 'ddog-gov.com',
      service: 'travel-pay',
      env: environment.vspEnvironment(),
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackInteractions: true,
      trackFrustrations: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask',
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
