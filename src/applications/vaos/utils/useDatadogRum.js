import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from 'platform/utilities/environment';
import { useSelector } from 'react-redux';
import { selectFeatureDatadogRum } from '../redux/selectors';

const initializeDatadogRum = () => {
  if (
    // Prevent RUM from running on local/CI environments.
    environment.BASE_URL.indexOf('localhost') < 0 &&
    // Prevent re-initializing the SDK.
    !window.DD_RUM?.getInitConfiguration()
  ) {
    datadogRum.init({
      applicationId: '8880279e-5c40-4f82-90f9-9a3cdb6d461b',
      clientToken: 'pub4705a09a8da66995fa85908096f42321',
      site: 'ddog-gov.com',
      service: 'va.gov-appointments',
      env: environment.vspEnvironment(),
      sampleRate: 100,
      sessionReplaySampleRate: 100,
      trackInteractions: true,
      trackFrustrations: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    });
  }
};

const useDatadogRum = () => {
  const featureDatadogRum = useSelector(state =>
    selectFeatureDatadogRum(state),
  );

  useEffect(
    () => {
      if (featureDatadogRum) {
        initializeDatadogRum();
      } else {
        delete window.DD_RUM;
      }
    },
    [featureDatadogRum],
  );
};

export { useDatadogRum };
