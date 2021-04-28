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

function useWebChat(props) {
  const {
    isLoading: frameworkLoading,
    error: frameworkError,
  } = useWaitForWebchatFramework(props);
  const { loading: tokenLoading, error: tokenError, token } = useLoadWebChat();

  return {
    loading: frameworkLoading || tokenLoading,
    error: frameworkError || tokenError,
    token,
  };
}

export default function App(props) {
  const { loading, error, token } = useWebChat(props);

  if (loading) {
    return <LoadingIndicator message={'Loading Virtual Agent'} />;
  }

  if (error) {
    return <ChatbotError />;
  }

  return (
    <div className={'vads-l-grid-container'}>
      <div className={'vads-l-row'} data-testid={'webchat-container'}>
        <WebChat token={token} />
      </div>
    </div>
  );
}
