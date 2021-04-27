import { useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import retryOnce from '../utils/retryOnce';

export default function useVirtualAgentToken() {
  const [token, setToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
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
      } catch (error) {
        setTokenLoading(false);
      }
    }
    getToken();
  }, []);

  return { token, tokenLoading };
}
