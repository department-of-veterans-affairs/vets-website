import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import selectLoadingFeatureToggle from '../selectors/selectFeatureTogglesLoading';

export function useWaitForCsrfToken(props) {
  // Once the feature toggles have loaded, the csrf token updates
  const csrfTokenLoading = useSelector(selectLoadingFeatureToggle);
  const [csrfTokenLoadingError, setCsrfTokenLoadingError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (csrfTokenLoading) {
        setCsrfTokenLoadingError(true);
        Sentry.captureException(
          new Error('Could not load feature toggles within timeout'),
        );
      }
    }, props.timeout);
    return function cleanup() {
      clearTimeout(timeout);
    };
  });

  return [csrfTokenLoading, csrfTokenLoadingError];
}
