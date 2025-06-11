import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import environment from 'platform/utilities/environment';

const env = environment.vspEnvironment();
const { sessionReplaySampleRate = 1, sessionSampleRate = 100 } =
  {
    vagovstaging: {
      sessionSampleRate: 100,
      sessionReplaySampleRate: 1,
    },
    vagovprod: {
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
    },
  }[env] || {};

// declare shared config between Logs and RUM
const DEFAULT_CONFIG = {
  applicationId: '95b5b8e2-3897-4aad-84f0-fdf538722529',
  clientToken: 'pubf685942b0ca36a596c8d0bd1d76c2715',
  site: 'ddog-gov.com',
  service: '1095-b-application',
  env,
  sessionSampleRate,
  sessionReplaySampleRate,
};

const initializeRealUserMonitoring = () => {
  if (!window.DD_RUM?.getInitConfiguration()) {
    datadogRum?.init({
      ...DEFAULT_CONFIG,
      defaultPrivacyLevel: 'mask',
    });

    // If sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();
  }
};

const intitalizeBrowserLogging = () => {
  // prevent LOGS from re-initializing the SDK
  if (!window.DD_LOGS?.getInitConfiguration()) {
    datadogLogs.init({
      ...DEFAULT_CONFIG,
      forwardErrorsToLogs: true,
    });
  }
};

const useBrowserMonitoring = () => {
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const isLoadingFeatureFlags = useToggleLoadingValue();
  const monitorPdfGeneration = useToggleValue(TOGGLE_NAMES.vetStatusPdfLogging);
  const monitoringEnabled =
    isLoadingFeatureFlags === false && monitorPdfGeneration === true;

  useEffect(
    () => {
      if (
        monitoringEnabled &&
        (environment.isStaging() || environment.isProduction()) &&
        !window.Mocha
      ) {
        // Enable browser logging
        intitalizeBrowserLogging();
        // Enable RUM
        initializeRealUserMonitoring();
      } else {
        delete window?.DD_RUM;
      }
    },
    [monitoringEnabled],
  );
};

export { useBrowserMonitoring };
