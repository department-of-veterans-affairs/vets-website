import { useEffect, useState } from 'react';

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

const initializeDatadogRum = async () => {
  if (
    // Prevent RUM from running on local/CI environments.
    environment.BASE_URL.indexOf('localhost') < 0 &&
    // Prevent re-initializing the SDK.
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  ) {
    try {
      const {
        datadogRum,
      } = await import(/* webpackChunkName: "datadog-rum" */ '@datadog/browser-rum');

      if (!datadogRumConfig.env) {
        datadogRumConfig.env = environment.vspEnvironment();
      }
      datadogRum.init(datadogRumConfig);
      datadogRum.startSessionReplayRecording();

      return datadogRum;
    } catch (error) {
      // Silent fail if the datadog library fails to load
      // eslint-disable-next-line no-console
      console.error('Failed to load DataDog RUM library:', error);
    }
  }
  return null;
};

// Function to add errors to DataDog
export const addDatadogError = async error => {
  try {
    const {
      datadogRum,
    } = await import(/* webpackChunkName: "datadog-rum" */ '@datadog/browser-rum');
    datadogRum.addError(error);
  } catch (e) {
    // Silent fail if the datadog library fails to load
    // eslint-disable-next-line no-console
    console.error('Failed to record error in DataDog:', e);
  }
};

const useDatadogRum = config => {
  const [datadogInstance, setDatadogInstance] = useState(null);

  useEffect(
    () => {
      const loadDatadog = async () => {
        const instance = await initializeDatadogRum();
        setDatadogInstance(instance);
      };

      loadDatadog();
    },
    [config],
  );

  return datadogInstance;
};

export { useDatadogRum };
