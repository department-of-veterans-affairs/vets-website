import React, { useMemo, useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';

export default function WebChat() {
  const { ReactWebChat, createDirectLine, createStore } = window.WebChat;
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

  const store = useMemo(() => createStore(), []);

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
