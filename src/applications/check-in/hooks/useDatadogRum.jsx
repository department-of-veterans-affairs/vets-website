import { useEffect, useMemo } from 'react';
import { datadogRum } from '@datadog/browser-rum';

import environment from 'platform/utilities/environment';
import { useSelector } from 'react-redux';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

const initializeDatadogRum = () => {
  // Prevent RUM from running on local/CI environments.
  if (
    environment.BASE_URL.indexOf('localhost') < 0 &&
    !window.DD_RUM?.getInitConfiguration()
  ) {
    datadogRum.init({
      applicationId: 'f61cc984-0ba6-4502-b4d0-fcae00cb8422',
      clientToken: 'pub65530b937303a0163a4ab3320e818340',
      site: 'ddog-gov.com',
      service: 'patient-check-in',
      env: environment.vspEnvironment(),
      sampleRate: 100,
      sessionReplaySampleRate: 20,
      trackInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask',
    });
    datadogRum.startSessionReplayRecording();
  }
};

const useDatadogRum = () => {
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isBrowserMonitoringEnabled, isLoadingFeatureFlags } = featureToggles;

  useEffect(
    () => {
      if (isLoadingFeatureFlags) {
        return;
      }
      if (isBrowserMonitoringEnabled) {
        initializeDatadogRum();
      } else {
        delete window.DD_RUM;
      }
    },
    [isBrowserMonitoringEnabled, isLoadingFeatureFlags],
  );
};

export { useDatadogRum };
