import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import selectLoadingFeatureToggle from '../selectors/selectFeatureTogglesLoading';
import { logErrorToDatadog } from '../utils/logging';
import { useDatadogLogging } from './useDatadogLogging';

export function useWaitForCsrfToken(props) {
  // Once the feature toggles have loaded, the csrf token updates
  const csrfTokenLoading = useSelector(selectLoadingFeatureToggle);
  const [csrfTokenLoadingError, setCsrfTokenLoadingError] = useState(false);
  const isDatadogLoggingEnabled = useDatadogLogging();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (csrfTokenLoading) {
        setCsrfTokenLoadingError(true);
        const error = new Error(
          'Could not load feature toggles within timeout',
        );
        Sentry.captureException(error);
        logErrorToDatadog(isDatadogLoggingEnabled, error.message, error);
      }
    }, props.timeout);
    return function cleanup() {
      clearTimeout(timeout);
    };
  });

  return [csrfTokenLoading, csrfTokenLoadingError];
}
