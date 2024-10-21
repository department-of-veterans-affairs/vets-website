import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from 'platform/utilities/environment';

const initDDRum = () => {
  const env = environment.vspEnvironment();

  const {
    sessionReplaySampleRate = 1,
    trackInteractions = false,
    trackUserInteractions = false,
  } =
    {
      vagovstaging: {
        sessionReplaySampleRate: 1,
        trackInteractions: false,
        trackUserInteractions: false,
      },
      vagovprod: {
        sessionReplaySampleRate: 10,
        trackInteractions: true,
        trackUserInteractions: true,
      },
    }[env] || {};

  datadogRum?.init({
    applicationId: '',
    clientToken: '',
    site: 'ddog-gov.com',
    service: 'identity',
    env,
    sessionSampleRate: 20,
    sessionReplaySampleRate,
    trackInteractions,
    trackUserInteractions,
    trackFrustrations: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });
};

export const useDatadogRum = () => {
  useEffect(() => {
    // 1. Prevents RUM from running on local/CI environments.
    // 2. Prevents re-initializing the SDK.
    if (
      (environment.isStaging() || environment.isProduction()) &&
      !window.DD_RUM?.getInitConfiguration() &&
      !window.Mocha
    ) {
      initDDRum();
    } else {
      delete window?.DD_RUM;
    }
  }, []);
};
