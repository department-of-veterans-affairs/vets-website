import React, { useState } from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { connect, useSelector } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import SignInModal from 'platform/user/authentication/components/SignInModal';
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

export const LOGGED_IN_FLOW = 'loggedInFlow';
export const IN_AUTH_EXP = 'inAuthExperience';
export const RECENT_UTTERANCES = 'recentUtterances';
export const INITIAL_UTTERANCES = ['', ''];

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

function showBot(
  loggedIn,
  requireAuth,
  accepted,
  minute,
  isAuthTopic,
  setIsAuthTopic,
  props,
) {
  if (!loggedIn && requireAuth) {
    return <ConnectedSignInAlert />;
  }

  if (!accepted && !sessionStorage.getItem(IN_AUTH_EXP)) {
    return <ChatboxDisclaimer />;
  }

  if (!loggedIn && isAuthTopic) {
    return (
      <SignInModal
        visible
        onClose={() => {
          setIsAuthTopic(false);
          sessionStorage.setItem(LOGGED_IN_FLOW, 'false');
        }}
      />
    );
  }

  return <App timeout={props.timeout || minute} />;
}

export default function Chatbox(props) {
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);
  const isAccepted = useSelector(state => state.virtualAgentData.termsAccepted);
  const requireAuth = useSelector(
    state => state.featureToggles.virtualAgentAuth,
  );
  const [isAuthTopic, setIsAuthTopic] = useState(false);
  const [utteranceArray, setUtteranceArray] = useState([]);

  window.addEventListener('webchat-auth-activity', () => {
    setTimeout(function() {
      if (!isLoggedIn) {
        sessionStorage.setItem(LOGGED_IN_FLOW, 'true');
        setIsAuthTopic(true);
      }
    }, 2000);
  });

  // blindly store the last two user utterances for later use
  // if user is prompted to login. empty string means no utterance
  // for that array element. (means no null checks later)
  window.addEventListener('webchat-message-activity', event => {
    if (
      event &&
      event.type === 'message' &&
      event.text &&
      event.text.length > 0 &&
      event.role !== 'bot'
    ) {
      // prefer to pull from state, then storage, then initialize if not found
      let utterances =
        utteranceArray ||
        sessionStorage.get(RECENT_UTTERANCES) ||
        [].push(INITIAL_UTTERANCES);

      // start with clean data, not executed after we get some text in there.
      if (!utterances || !Array.isArray(utterances) || utterances.length < 2) {
        utterances = [].push(INITIAL_UTTERANCES);
      }

      utterances.push(event.text);
      utterances.shift();
      sessionStorage.setItem(RECENT_UTTERANCES, utterances);
      setUtteranceArray(utterances);
    }
  });

  if (sessionStorage.getItem(LOGGED_IN_FLOW) === 'true' && isLoggedIn) {
    sessionStorage.setItem(IN_AUTH_EXP, 'true');
    sessionStorage.setItem(LOGGED_IN_FLOW, 'false');
  }

  const ONE_MINUTE = 60 * 1000;
  return (
    <div className="vads-u-padding--1p5 vads-u-background-color--gray-lightest">
      <div className="vads-u-background-color--primary-darkest vads-u-padding--1p5">
        <h2 className="vads-u-font-size--lg vads-u-color--white vads-u-margin--0">
          VA virtual agent
        </h2>
      </div>
      {showBot(
        isLoggedIn,
        requireAuth,
        isAccepted,
        ONE_MINUTE,
        isAuthTopic,
        setIsAuthTopic,
        props,
      )}
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
      return <LoadingIndicator message="Loading Virtual Agent" />;
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
