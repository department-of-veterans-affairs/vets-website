import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const initializeDatadogRum = config => {
  if (
    // Prevent RUM from running on local/CI environments.
    environment.BASE_URL.indexOf('localhost') < 0 &&
    // Prevent re-initializing the SDK.
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  ) {
    const datadogRumConfig = config;
    if (!datadogRumConfig.env) {
      datadogRumConfig.env = environment.vspEnvironment();
    }
    datadogRum.init(datadogRumConfig);
    datadogRum.startSessionReplayRecording();
  }
};

const useDatadogRum = (config, userInfo) => {
  useEffect(
    () => {
      initializeDatadogRum(config);
      if (userInfo.loggedIn && environment.isStaging()) {
        datadogRum.setUser({
          id: userInfo.accountUuid || 'no-account-uuid-found',
        });
      }
    },
    [config, userInfo],
  );
};

export { useDatadogRum };
