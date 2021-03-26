import React, { useMemo, useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';

export default function WebChat() {
  const { ReactWebChat, createDirectLine } = window.WebChat;
  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      const res = await apiRequest('/virtual_agent_token', {
        method: 'POST',
      });
      setToken(res.token);
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
      <div
        className={'vads-l-row'}
        data-testid={'webchat'}
        style={{ height: '500px' }}
      >
        <ReactWebChat
          styleOptions={{ hideUploadButton: true }}
          directLine={directLine}
          store={store}
          userID="12345"
        />
      </div>
    </div>
  );
}
