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
      applicationId: '1f81f762-c3fc-48c1-89d5-09d9236e340d',
      clientToken: 'pub3e48a5b97661792510e69581b3b272d1',
      site: 'ddog-gov.com',
      service: 'mhv-on-va.gov',
      env: environment.vspEnvironment(),
      sessionSampleRate: 100,
      sessionReplaySampleRate: 10,
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
