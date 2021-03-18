import React, { useMemo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { apiRequest } from 'platform/utilities/api';

window.React = React;
window.ReactDOM = ReactDOM;

const loadWebChat = () => {
  const script = document.createElement('script');

  script.src =
    'https://cdn.botframework.com/botframework-webchat/4.12.0/webchat-es5.js';
  script.crossOrigin = 'anonymous';

  document.body.appendChild(script);
};

loadWebChat();

export default function App() {
  const [isLoaded, setLoaded] = useState(!!window.WebChat);

  if (!isLoaded) {
    setTimeout(() => {
      if (window.WebChat) {
        setLoaded(true);
      }
    }, 300);
    return 'waiting on webchat framework . . .';
  }

  return <ActualApp />;
}

function ActualApp() {
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
        <ReactWebChat directLine={directLine} store={store} userID="12345" />
      </div>
    </div>
  );
}
