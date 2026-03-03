import { useEffect, useRef } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import environment from '~/platform/utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

// Configuration constants
const CONFIG = {
  applicationId: 'ed578a2f-233a-4325-a486-d094b369359d',
  clientToken: 'puba5417576e681deca63cfc4af20d16950',
  site: 'ddog-gov.com',
  service: 'va.gov-profile',
  env: environment.vspEnvironment(),
  sessionSampleRate: 100,
  sessionReplaySampleRate: 3,
  trackBfcacheViews: true,
  trackUserInteractions: true,
  defaultPrivacyLevel: 'mask-user-input',
};

export const initializeBrowserMonitoring = () => {
  if (environment.isLocalhost()) {
    return false;
  }

  if (window.DD_RUM?.getInitConfiguration()) {
    datadogRum.stopSession();
    delete window.DD_RUM;
  }

  datadogRum.init({
    ...CONFIG,
  });

  if (CONFIG.sessionReplaySampleRate > 0) {
    datadogRum.startSessionReplayRecording();
  }
  return true;
};

export const useBrowserMonitoring = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const initializedByProfile = useRef(false);

  const isMonitoringEnabled = useToggleValue(
    TOGGLE_NAMES.profileBrowserMonitoring,
  );

  useEffect(
    () => {
      if (isMonitoringEnabled) {
        initializedByProfile.current = initializeBrowserMonitoring();
      }

      return () => {
        if (
          initializedByProfile.current &&
          window.DD_RUM?.getInitConfiguration()
        ) {
          datadogRum.stopSession();
          delete window.DD_RUM;
        }
      };
    },
    [isMonitoringEnabled],
  );
};
