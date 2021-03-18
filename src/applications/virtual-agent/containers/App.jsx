import React, { useMemo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { apiRequest } from 'platform/utilities/api';

window.React = React;
window.ReactDOM = ReactDOM;

const script = document.createElement('script');

script.src =
  'https://cdn.botframework.com/botframework-webchat/4.12.0/webchat-es5.js';
script.crossOrigin = 'anonymous';

document.body.appendChild(script);

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
      }),
    [token],
  );

  return (
    <div className={'vads-l-grid-container'}>
      <div className={'vads-l-row'} style={{ height: '200px' }}>
        <ReactWebChat directLine={directLine} store={store} userID="12345" />
      </div>
    </div>
  );
}
