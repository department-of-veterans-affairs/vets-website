import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';

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

const useDatadogRum = config => {
  useEffect(
    () => {
      initializeDatadogRum(config);
    },
    [config],
  );
};

export { useDatadogRum };
