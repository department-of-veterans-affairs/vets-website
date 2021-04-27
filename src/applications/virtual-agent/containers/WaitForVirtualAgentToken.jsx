import React, { useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import ChatbotError from './ChatbotError';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import retryOnce from '../utils/retryOnce';
import WebChat from './WebChat';

export default function WaitForVirtualAgentToken() {
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

  return (
    <div className={'vads-l-grid-container'}>
      <div className={'vads-l-row'} data-testid={'webchat-container'}>
        {token && <WebChat token={token} />}
        {!token && !tokenLoading && <ChatbotError />}
        {tokenLoading && <LoadingIndicator message={'Loading Virtual Agent'} />}
      </div>
    </div>
  );
}
