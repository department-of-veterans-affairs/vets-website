import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';

const initializeDatadogRum = config => {
  const datadogRumConfig = config;
  if (!datadogRumConfig.env) {
    datadogRumConfig.env = environment.vspEnvironment();
  }
  datadogRum.init(datadogRumConfig);
  datadogRum.startSessionReplayRecording();
};

const setRumUser = user => {
  datadogRum.setUser({
    id: user.id || 'no-id-found',
  });
};

const useDatadogRum = config => {
  useEffect(
    () => {
      if (
        // Prevent RUM from running on local/CI environments.
        environment.BASE_URL.indexOf('localhost') < 0 &&
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

// REMINDER: Always be conscience of PII and Datadog
const setDatadogRumUser = user => {
  if (
    // // Prevent RUM from running on local/CI environments.
    environment.BASE_URL.indexOf('localhost') < 0 &&
    // Only run if DD is configured.
    window.DD_RUM?.getInitConfiguration() &&
    // Not during unit tests
    !window.Mocha &&
    user?.id
  ) {
    setRumUser({ id: user.id });
  }
};

export { useDatadogRum, setDatadogRumUser };
