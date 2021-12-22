import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ChatbotError from '../chatbot-error/ChatbotError';
import useWebChatFramework from './useWebChatFramework';
import useVirtualAgentToken from './useVirtualAgentToken';
import WebChat from '../webchat/WebChat';
import ChatboxDisclaimer from './ChatboxDisclaimer.jsx';
import {
  combineLoadingStatus,
  COMPLETE,
  ERROR,
  LOADING,
} from './loadingStatus';
import { connect, useSelector } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

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
    apiSession: token.apiSession,
  };
}

// function handleDisclaimerAcceptedOnClick() {
//   return true;
// }

function showBot(loggedIn, requireAuth, accepted, minute, props) {
  if (!loggedIn && requireAuth) {
    return <ConnectedSignInAlert />;
  } else if (!accepted) {
    return <ChatboxDisclaimer />;
  } else {
    return <App timeout={props.timeout || minute} />;
  }
}

export default function Chatbox(props) {
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);
  const isAccepted = useSelector(state => state.virtualAgentData.termsAccepted);
  const requireAuth = useSelector(
    state => state.featureToggles.virtualAgentAuth,
  );

  const ONE_MINUTE = 60 * 1000;
  return (
    <div className="vads-u-padding--1p5 vads-u-background-color--gray-lightest">
      <div className="vads-u-background-color--primary-darkest vads-u-padding--1p5">
        <h2 className="vads-u-font-size--lg vads-u-color--white vads-u-margin--0">
          VA Virtual Agent (beta)
        </h2>
      </div>
      {showBot(isLoggedIn, requireAuth, isAccepted, ONE_MINUTE, props)}
    </div>
  );
}

function SignInAlert({ showLoginModal }) {
  return (
    <va-alert status="continue">
      <h2 slot="headline" className="vads-u-margin-y--0 vads-u-font-size--h3">
        Please sign in to access the chatbot
      </h2>
      <br />
      <button
        className="usa-button-primary"
        onClick={() => showLoginModal(true)}
      >
        Sign in to VA.gov
      </button>
    </va-alert>
  );
}

const mapDispatchToProps = {
  showLoginModal: toggleLoginModal,
};

const ConnectedSignInAlert = connect(
  null,
  mapDispatchToProps,
)(SignInAlert);

function App(props) {
  const { token, WebChatFramework, loadingStatus, apiSession } = useWebChat(
    props,
  );

  switch (loadingStatus) {
    case ERROR:
      return <ChatbotError />;
    case LOADING:
      return <LoadingIndicator message={'Loading Virtual Agent'} />;
    case COMPLETE:
      return (
        <WebChat
          token={token}
          WebChatFramework={WebChatFramework}
          apiSession={apiSession}
        />
      );
    default:
      throw new Error(`Invalid loading status: ${loadingStatus}`);
  }
}
