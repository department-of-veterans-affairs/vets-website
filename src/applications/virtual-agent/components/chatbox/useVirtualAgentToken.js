import { useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import retryOnce from './retryOnce';
import { useSelector } from 'react-redux';
import * as Sentry from '@sentry/browser';

function useWaitForCsrfToken(props) {
  // Once the feature toggles have loaded, the csrf token updates
  const csrfTokenLoading = useSelector(state => state.featureToggles.loading);
  const [csrfTokenLoadingError, setCsrfTokenLoadingError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (csrfTokenLoading) {
        setCsrfTokenLoadingError(true);
        Sentry.captureException(
          new Error('Could not load feature toggles within timeout'),
        );
      }
    }, props.timeout);
  }, []);

  return [csrfTokenLoading, csrfTokenLoadingError];
}

export default function useVirtualAgentToken(props) {
  const [token, setToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);
  const [error, setError] = useState(false);
  const [csrfTokenLoading, csrfTokenLoadingError] = useWaitForCsrfToken(props);

  useEffect(
    () => {
      if (csrfTokenLoadingError) {
        setError(true);
        setTokenLoading(false);
      }
      if (csrfTokenLoading) return;

      async function callVirtualAgentTokenApi() {
        return apiRequest('/virtual_agent_token', {
          method: 'POST',
        });
      }

      async function getToken() {
        try {
          const response = await retryOnce(callVirtualAgentTokenApi);

          setTokenLoading(false);
          setToken(response.token);
        } catch (ex) {
          Sentry.captureException(
            new Error('Could not retrieve virtual agent token'),
          );
          setTokenLoading(false);
          setError(true);
        }
      }
      getToken();
    },
    [csrfTokenLoading, csrfTokenLoadingError],
  );

  return { token, tokenLoading, error };
}
