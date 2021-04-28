import React from 'react';
import ReactDOM from 'react-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ChatbotError from './ChatbotError';
import useWaitForWebchatFramework from './useWaitForWebchatFramework';
import useWaitForFeatureToggles from './useWaitForFeatureToggles';
import useVirtualAgentToken from './useVirtualAgentToken';
import WebChat from './WebChat';

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

export default function App(props) {
  const { isLoading, error } = useWaitForWebchatFramework(props);

  if (isLoading) {
    return (
      <LoadingIndicator
        data-testid="waiting-for-framework"
        message={'Loading Virtual Agent'}
      />
    );
  }
  return error ? <ChatbotError /> : <WaitForFeatureToggles />;
}

function useLoadWebChat() {
  const { loading: togglesLoading } = useWaitForFeatureToggles();
  const { tokenLoading, error, token } = useVirtualAgentToken({
    togglesLoading,
  });

  return {
    loading: togglesLoading || tokenLoading,
    error,
    token,
  };
}

function WaitForFeatureToggles() {
  const { loading, error, token } = useLoadWebChat();

  return (
    <div className={'vads-l-grid-container'}>
      <div className={'vads-l-row'} data-testid={'webchat-container'}>
        {token && <WebChat token={token} />}
        {error && <ChatbotError />}
        {loading && <LoadingIndicator message={'Loading Virtual Agent'} />}
      </div>
    </div>
  );
}

// function NewApp() {
//   const { isLoading, isError, token } = useWebChat();

//   if (isLoading) {
//     return <LoadingIndicator message={'Loading Virtual Agent'} />;
//   }

//   if (isError) {
//     return <ChatbotError />;
//   }

//   return <WebChat token={token} />;
// }
