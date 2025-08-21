import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const datadogRumConfig = {
  applicationId: '8880279e-5c40-4f82-90f9-9a3cdb6d461b',
  clientToken: 'pubcf8129b0768db883d760a1fd6abdc8a0',
  site: 'ddog-gov.com',
  service: 'avs',
  env: environment.vspEnvironment(),
  sampleRate: 100,
  sessionReplaySampleRate: 100,
  trackInteractions: true,
  trackFrustrations: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask',
  beforeSend: event => {
    // Prevent PII from being sent to Datadog with click actions.
    if (event.action?.type === 'click') {
      // eslint-disable-next-line no-param-reassign
      event.action.target.name = 'AVS item';
    }
    return true;
  },
};

const initializeDatadogRum = () => {
  if (
    // Prevent RUM from running on local/CI environments.
    environment.BASE_URL.indexOf('localhost') < 0 &&
    // Prevent re-initializing the SDK.
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  ) {
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
      initializeDatadogRum();
    },
    [config],
  );
};

export { useDatadogRum };
