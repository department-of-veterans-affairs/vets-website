import { useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import retryOnce from './retryOnce';
import { useSelector } from 'react-redux';

export default function useVirtualAgentToken() {
  const [token, setToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);
  const [error, setError] = useState(false);
  const togglesLoading = useSelector(state => state.featureToggles.loading);

  useEffect(
    () => {
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
          setTokenLoading(false);
          setError(true);
        }
      }
      getToken();
    },
    [togglesLoading],
  );

  return { token, tokenLoading, error };
}
