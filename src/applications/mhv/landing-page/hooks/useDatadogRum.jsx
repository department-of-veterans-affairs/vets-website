import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const initializeDatadogRum = () => {
  if (
    // Prevent RUM from running on local/CI environments.
    environment.BASE_URL.indexOf('localhost') < 0 &&
    // Prevent re-initializing the SDK.
    !window.DD_RUM?.getInitConfiguration()
  ) {
    datadogRum.init({
      applicationId: '1f81f762-c3fc-48c1-89d5-09d9236e340d',
      clientToken: 'pub3e48a5b97661792510e69581b3b272d1',
      site: 'ddog-gov.com',
      service: 'mhv-on-va.gov',
      env: environment.vspEnvironment(),
      sampleRate: 100,
      sessionReplaySampleRate: 0,
      trackInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    });
  }
};

const useDatadogRum = () => {
  useEffect(() => {
    initializeDatadogRum();
  }, []);
};

export { useDatadogRum };
