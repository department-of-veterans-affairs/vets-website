import React, { useMemo, useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

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
      <div className={'vads-l-row'} style={{ height: '500px' }}>
        {token && (
          <div data-testid={'webchat'}>
            <ReactWebChat
              styleOptions={{ hideUploadButton: true }}
              directLine={directLine}
              store={store}
            />
          </div>
        )}
        {!token && (
          <AlertBox
            content="We’re making some updates to the Virtual Agent. We’re sorry it’s not working right now. Please check back soon. If you require immediate assistance please call the VA.gov help desk at 800-698-2411 (TTY: 711)."
            headline=""
            onCloseAlert={function noRefCheck() {}}
            status="error"
          />
        )}
      </div>
    </div>
  );
}
