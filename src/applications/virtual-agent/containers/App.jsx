import React, { useMemo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { apiRequest } from 'platform/utilities/api';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

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

function App({ featureTogglesLoading }) {
  const [isLoaded, setLoaded] = useState(!!window.WebChat);

  if (!isLoaded) {
    const intervalId = setInterval(() => {
      if (window.WebChat) {
        setLoaded(true);
        clearInterval(intervalId);
      }
    }, 300);
    return 'waiting on webchat framework . . .';
  }

  return <ActualApp featureTogglesLoading={featureTogglesLoading} />;
}

const mapStateToProps = state => {
  return {
    featureTogglesLoading: state.featureToggles.loading,
  };
};

export default connect(mapStateToProps)(App);

function ActualApp({ featureTogglesLoading }) {
  const { ReactWebChat, createDirectLine, createStore } = window.WebChat;
  const [token, setToken] = useState('');

  useEffect(
    () => {
      async function getToken() {
        if (featureTogglesLoading) return;
        const res = await apiRequest('/virtual_agent_token', {
          method: 'POST',
        });
        setToken(res.token);
      }
      getToken();
    },
    [featureTogglesLoading],
  );

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

  if (featureTogglesLoading) {
    return <LoadingIndicator message={'Loading Chatbot'} />;
  }

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
