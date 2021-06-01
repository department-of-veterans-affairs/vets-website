import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ChatbotError from '../chatbot-error/ChatbotError';
import useWebChatFramework from './useWebChatFramework';
import useVirtualAgentToken from './useVirtualAgentToken';
import WebChat from '../webchat/WebChat';
import {
  combineLoadingStatus,
  COMPLETE,
  ERROR,
  LOADING,
} from './loadingStatus';

function useWebChat(props) {
  const webchatFramework = useWebChatFramework(props);
  const token = useVirtualAgentToken(props);

  const loadingStatus = combineLoadingStatus(
    webchatFramework.loadingStatus,
    token.loadingStatus,
  );

  return {
    token: token.token,
    WebChatFramework: webchatFramework.WebChatFramework,
    loadingStatus,
  };
}

export default function Chatbox(props) {
  const ONE_MINUTE = 1 * 60 * 1000;
  return (
    <div className="vads-u-padding--1p5 vads-u-background-color--gray-lightest">
      <div className="vads-u-background-color--primary-darkest vads-u-padding--1p5">
        <h2 className="vads-u-font-size--lg vads-u-color--white vads-u-margin--0">
          VA Virtual Agent (beta)
        </h2>
      </div>
      <App timeout={props.timeout || ONE_MINUTE} />
    </div>
  );
}

function App(props) {
  const { token, WebChatFramework, loadingStatus } = useWebChat(props);

  switch (loadingStatus) {
    case ERROR:
      return <ChatbotError />;
    case LOADING:
      return <LoadingIndicator message={'Loading Virtual Agent'} />;
    case COMPLETE:
      return <WebChat token={token} WebChatFramework={WebChatFramework} />;
    default:
      throw new Error(`Invalid loading status: ${loadingStatus}`);
  }
}
