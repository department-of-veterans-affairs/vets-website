import React, { useMemo, useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import ChatbotError from './ChatbotError';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import MarkdownRenderer from '../utils/markdownRenderer';
import retryOnce from '../utils/retryOnce';
import makeBotGreetUser from '../utils/webchat/makeBotGreetUser';

const renderMarkdown = text => MarkdownRenderer.render(text);

export default function WebChat() {
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
        {token && <ChatBox token={token} />}
        {!token && !tokenLoading && <ChatbotError />}
        {tokenLoading && <LoadingIndicator message={'Loading Virtual Agent'} />}
      </div>
    </div>
  );
}

const ChatBox = ({ token }) => {
  const { ReactWebChat, createDirectLine, createStore } = window.WebChat;

  const store = createStore({}, makeBotGreetUser);

  const directLine = useMemo(
    () =>
      createDirectLine({
        token,
        domain:
          'https://northamerica.directline.botframework.com/v3/directline',
      }),
    [token, createDirectLine],
  );

  return (
    <div data-testid={'webchat'} style={{ height: '500px', width: '100%' }}>
      <ReactWebChat
        styleOptions={{ hideUploadButton: true }}
        directLine={directLine}
        store={store}
        renderMarkdown={renderMarkdown}
      />
    </div>
  );
};
