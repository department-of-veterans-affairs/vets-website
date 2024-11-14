import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from 'platform/utilities/environment';

const initDDRum = () => {
  const env = environment.vspEnvironment();

  const {
    sessionReplaySampleRate = 1,
    trackInteractions = false,
    trackUserInteractions = false,
    sessionSampleRate = 100,
  } =
    {
      vagovstaging: {
        sessionSampleRate: 100,
        sessionReplaySampleRate: 1,
        trackInteractions: false,
        trackUserInteractions: false,
      },
      vagovprod: {
        sessionSampleRate: 20,
        sessionReplaySampleRate: 10,
        trackInteractions: true,
        trackUserInteractions: true,
      },
    }[env] || {};

  datadogRum?.init({
    applicationId: '73e0e2fb-7b2a-4d4a-8231-35ef2123f607',
    clientToken: 'pub2dfeb9f2606a756df3ddd4bd5c8a6b3c',
    site: 'ddog-gov.com',
    service: 'identity',
    env,
    sessionSampleRate,
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
