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

function App(props) {
  const { loading, error, token, WebChatFramework } = useWebChat(props);

  if (loading) {
    return <LoadingIndicator message={'Loading Virtual Agent'} />;
  }

  if (error) {
    return <ChatbotError />;
  }

  return (
    <div data-testid={'webchat-container'}>
      <WebChat token={token} WebChatFramework={WebChatFramework} />
    </div>
  );
}

export default function Page(props) {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4">
          <App {...props} />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
          <h1>About this study</h1>

          <p>
            Thank you for participating in this study. We know your time is
            valuable, and your feedback will help us build better products to
            serve you.
          </p>

          <p>
            We are exploring how a virtual agent/chatbot may help you find
            answers on Va.gov. To help us understand this, we created this
            prototype for you to test. You can try a question like “Is
            healthcare covered?” or ask any other question you like. Because
            this virtual agent is still in development (beta), it will not have
            answers to all your questions, and cannot do the following:
          </p>

          <ul>
            <li>
              Assess, detect, or provide a medical or mental health diagnosis
            </li>
            <li>
              Provide medical or mental health advice, treatment, or counseling
            </li>
            <li>Escalate an emergency</li>
            <li>Escalate directly to VA.gov support personnel</li>
            <li>Troubleshoot login issues</li>
          </ul>

          <p>
            Please do not enter personal information that someone can use to
            identify you personally.
          </p>

          <p>
            We have created a survey to help you help us build a better bot.
            When you're ready, [please tell us about your experience] and how we
            can improve.
          </p>

          <p>As always, we thank you for your service.</p>
        </div>
      </div>
    </div>
  );
}
