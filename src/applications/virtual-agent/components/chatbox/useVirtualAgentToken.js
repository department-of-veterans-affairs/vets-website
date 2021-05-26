import { useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import retryOnce from './retryOnce';
import { useSelector } from 'react-redux';
import * as Sentry from '@sentry/browser';

function useFeatureToggles() {
  const togglesLoading = useSelector(state => state.featureToggles.loading);
  const [togglesLoadingError, setTogglesLoadingError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (togglesLoading) {
        setTogglesLoadingError(true);
      }
    }, 100);
  });

  return [togglesLoading, togglesLoadingError];
}

export default function useVirtualAgentToken() {
  const [token, setToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);
  const [error, setError] = useState(false);
  const [togglesLoading, togglesLoadingError] = useFeatureToggles();

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
