import React from 'react';
import ReactDOM from 'react-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ChatbotError from '../chatbot-error/ChatbotError';
import useWebChatFramework from './useWebChatFramework';
import useVirtualAgentToken from './useVirtualAgentToken';
import WebChat from '../webchat/WebChat';

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

function useWebChat(props) {
  const webchatFramework = useWebChatFramework(props);
  const token = useVirtualAgentToken();

  return {
    loading: webchatFramework.isLoading || token.tokenLoading,
    error: webchatFramework.error || token.error,
    token: token.token,
    WebChatFramework: webchatFramework.WebChatFramework,
  };
}

export default function App(props) {
  const { loading, error, token, WebChatFramework } = useWebChat(props);

  if (loading) {
    return <LoadingIndicator message={'Loading Virtual Agent'} />;
  }

  if (error) {
    return <ChatbotError />;
  }

  return (
    <div
      data-testid={'webchat-container'}
      className="vads-u-padding--1p5 vads-u-background-color--gray-lightest"
    >
      <div className="chat-header vads-u-padding--1p5">
        <h2 className="vads-u-font-size--lg vads-u-margin--0">
          VA Virtual Agent
        </h2>
      </div>
      <WebChat token={token} WebChatFramework={WebChatFramework} />
    </div>
  );
}
