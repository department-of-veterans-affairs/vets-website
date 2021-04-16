import React, { useMemo, useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import ChatbotError from './ChatbotError';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

export default function WebChat() {
  const { ReactWebChat, createDirectLine } = window.WebChat;
  const [token, setToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    async function getToken() {
      try {
        const res = await apiRequest('/virtual_agent_token', {
          method: 'POST',
        });
        setTokenLoading(false);
        setToken(res.token);
      } catch (error) {
        setTokenLoading(false);
      }
    }
    getToken();
  }, []);

  const store = window.WebChat.createStore(
    {},
    ({ dispatch }) => next => action => {
      if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
        dispatch({
          meta: {
            method: 'keyboard',
          },
          payload: {
            activity: {
              channelData: {
                postBack: true,
              },
              // Web Chat will show the 'Greeting' System Topic message which has a trigger-phrase 'hello'
              name: 'startConversation',
              type: 'event',
            },
          },
          type: 'DIRECT_LINE/POST_ACTIVITY',
        });
      }
      return next(action);
    },
  );

  const directLine = useMemo(
    () =>
      createDirectLine({
        token,
        domain:
          'https://northamerica.directline.botframework.com/v3/directline',
      }),
    [token],
  );

  return (
    <div data-testid={'webchat-container'}>
      {token && (
        <div data-testid={'webchat'}>
          <ReactWebChat
            styleOptions={{ hideUploadButton: true }}
            directLine={directLine}
            store={store}
          />
        </div>
      )}
      {!token && !tokenLoading && <ChatbotError />}
      {tokenLoading && <LoadingIndicator message={'Loading Chatbot'} />}
    </div>
  );
}
