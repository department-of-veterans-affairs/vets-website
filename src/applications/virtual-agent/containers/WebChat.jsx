import React, { useMemo, useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import ChatbotError from './ChatbotError';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import MarkdownRenderer from '../utils/markdownRenderer';

const renderMarkdown = text => MarkdownRenderer.render(text);

export default function WebChat() {
  const { ReactWebChat, createDirectLine } = window.WebChat;
  const [token, setToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    async function getVirtualAgentToken() {
      return apiRequest('/virtual_agent_token', {
        method: 'POST',
      });
    }

    async function retryOnce(retryableFunction) {
      try {
        return await retryableFunction();
      } catch (error) {
        // eslint-disable-next-line no-return-await
        return await retryableFunction();
      }
    }

    async function getToken() {
      try {
        const response = await retryOnce(() => getVirtualAgentToken());
        setToken(response.token);
      } catch (error) {
        setTokenLoading(false);
      }

      setTokenLoading(false);
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
    <div className={'vads-l-grid-container'}>
      <div className={'vads-l-row'} data-testid={'webchat-container'}>
        {token && (
          <div
            data-testid={'webchat'}
            style={{ height: '500px', width: '100%' }}
          >
            <ReactWebChat
              styleOptions={{ hideUploadButton: true }}
              directLine={directLine}
              store={store}
              renderMarkdown={renderMarkdown}
            />
          </div>
        )}
        {!token && !tokenLoading && <ChatbotError />}
        {tokenLoading && <LoadingIndicator message={'Loading Virtual Agent'} />}
      </div>
    </div>
  );
}
