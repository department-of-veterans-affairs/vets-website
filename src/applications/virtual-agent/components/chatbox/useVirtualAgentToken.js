import { useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import retryOnce from './retryOnce';
import { useSelector } from 'react-redux';
import * as Sentry from '@sentry/browser';

function useFeatureToggles(props) {
  const togglesLoading = useSelector(state => state.featureToggles.loading);
  const [togglesLoadingError, setTogglesLoadingError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (togglesLoading) {
        setTogglesLoadingError(true);
        Sentry.captureException(
          new Error('Could not load feature toggles within timeout'),
        );
      }
    }, props.timeout);
  }, []);

  return [togglesLoading, togglesLoadingError];
}

export default function useVirtualAgentToken(props) {
  const [token, setToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);
  const [error, setError] = useState(false);
  const [togglesLoading, togglesLoadingError] = useFeatureToggles(props);

  useEffect(
    () => {
      if (togglesLoadingError) {
        setError(true);
        setTokenLoading(false);
      }
      if (togglesLoading) return;

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
    [togglesLoading, togglesLoadingError],
  );

  return { token, tokenLoading, error };
}
