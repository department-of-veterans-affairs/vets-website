import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
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
import { storeUtterances, LOGGED_IN_FLOW, IN_AUTH_EXP } from './utils';

// const ONE_MINUTE_IN_MS = 60_000;

function useWebChat(props, virtualAgentUpgradeWebchat14158) {
  const webchatFramework = useWebChatFramework(
    props,
    virtualAgentUpgradeWebchat14158,
  );
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
  accepted,
  minute,
  isAuthTopic,
  setIsAuthTopic,
  props,
) {
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
  const [isAuthTopic, setIsAuthTopic] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [chatBotLoadTime] = useState(Date.now());
  const ONE_SEC_IN_MILLISECONDS = 1000;
  const ONE_MIN = ONE_SEC_IN_MILLISECONDS * 60;

  window.addEventListener('webchat-auth-activity', () => {
    setTimeout(function() {
      if (!isLoggedIn) {
        sessionStorage.setItem(LOGGED_IN_FLOW, 'true');
        setIsAuthTopic(true);
      }
    }, 2000);
  });

  useEffect(() => {
    window.addEventListener('bot-outgoing-activity', () => {
      const currentTime = Date.now();

      if (lastMessageTime && currentTime - lastMessageTime > 30 * ONE_MIN) {
        window.location.reload();
      } else {
        setLastMessageTime(currentTime);
      }

      if (currentTime - chatBotLoadTime > 60 * ONE_MIN) {
        window.location.reload();
      }
    });
  });

  useEffect(() => {
    // initiate the event handler
    window.addEventListener('webchat-message-activity', storeUtterances);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener('webchat-message-activity', storeUtterances);
    };
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
          VA chatbot (beta)
        </h2>
      </div>
      {showBot(
        isLoggedIn,
        isAccepted,
        ONE_MINUTE,
        isAuthTopic,
        setIsAuthTopic,
        props,
      )}
    </div>
  );
}

function App(props) {
  const { virtualAgentUpgradeWebchat14158 } = useSelector(
    state => {
      return {
        virtualAgentUpgradeWebchat14158:
          state.featureToggles[
            FEATURE_FLAG_NAMES.virtualAgentUpgradeWebchat14158
          ],
      };
    },
    state => state.featureToggles,
  );
  const { token, WebChatFramework, loadingStatus, apiSession } = useWebChat(
    props,
    virtualAgentUpgradeWebchat14158,
  );

  switch (loadingStatus) {
    case ERROR:
      return <ChatbotError />;
    case LOADING:
      return <va-loading-indicator message="Loading Chatbot" />;
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
