import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

const initializeDatadogRum = config => {
  const datadogRumConfig = config;
  if (!datadogRumConfig.env) {
    datadogRumConfig.env = environment.vspEnvironment();
  }
  datadogRum.init(datadogRumConfig);
  datadogRum.startSessionReplayRecording();
};

const setRumUser = user => {
  if (user.loggedIn) {
    datadogRum.setUser({
      id: user.id || 'no-id-found',
    });
  }
};

const useDatadogRum = config => {
  useEffect(
    () => {
      if (
        // Prevent RUM from running on local/CI environments.
        // environment.BASE_URL.indexOf('localhost') < 0 &&
        // Prevent re-initializing the SDK.
        !window.DD_RUM?.getInitConfiguration() &&
        !window.Mocha
      ) {
        initializeDatadogRum(config);
      }
    },
    [config],
  );
};

// REMINDER: Also be conscience of PII and Datadog
const useDatadogRumUser = user => {
  useEffect(
    () => {
      if (
        // // Prevent RUM from running on local/CI environments.
        // environment.BASE_URL.indexOf('localhost') < 0 &&
        // Only run if DD is configured.
        window.DD_RUM?.getInitConfiguration() &&
        // Not during unit tests
        !window.Mocha
      ) {
        const url = '/analytics/v0/user/hashes';
        apiRequest(url).then(data => {
          setRumUser({ ...user, data });
        });
      }
    },
    [user],
  );
};

export { useDatadogRum, useDatadogRumUser };
