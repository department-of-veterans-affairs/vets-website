import React, { useState, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
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

const getLoadingStatus = (
  webchatLoadingStatus,
  tokenLoadingStatus,
  paramLoadingStatus,
  featureFlag,
) => {
  const preliminaryCombinedLoadingStatus = combineLoadingStatus(
    webchatLoadingStatus,
    tokenLoadingStatus,
  );
  if (featureFlag) {
    // we run this again to add a 3rd status to the mix
    return combineLoadingStatus(
      preliminaryCombinedLoadingStatus,
      paramLoadingStatus,
    );
  }
  // the original logic only combined 2 statuses
  return preliminaryCombinedLoadingStatus;
};

function useWebChat(props, paramLoadingStatus) {
  const webchatFramework = useWebChatFramework(props);
  const token = useVirtualAgentToken(props);

  const loadingStatus = getLoadingStatus(
    webchatFramework.loadingStatus,
    token.loadingStatus,
    paramLoadingStatus,
    props.virtualAgentEnableParamErrorDetection,
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

  return (
    <App
      timeout={props.timeout || minute}
      virtualAgentEnableParamErrorDetection={
        props.virtualAgentEnableParamErrorDetection
      }
      virtualAgentEnableMsftPvaTesting={props.virtualAgentEnableMsftPvaTesting}
      virtualAgentEnableNluPvaTesting={props.virtualAgentEnableNluPvaTesting}
    />
  );
}

function Chatbox(props) {
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
  // Default to complete because when feature toggles are loaded we assume paramLoadingStatus is complete and will error out otherwise
  const [paramLoadingStatus, setParamLoadingStatus] = useState(COMPLETE);
  const { token, WebChatFramework, loadingStatus, apiSession } = useWebChat(
    props,
    paramLoadingStatus,
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
          setParamLoadingStatus={setParamLoadingStatus}
        />
      );
    default:
      throw new Error(`Invalid loading status: ${loadingStatus}`);
  }
}

const mapStateToProps = state => ({
  virtualAgentEnableParamErrorDetection: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentEnableParamErrorDetection
  ],
  virtualAgentEnableMsftPvaTesting: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentEnableMsftPvaTesting
  ],
  virtualAgentEnableNluPvaTesting: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentEnableNluPvaTesting
  ],
});

export default connect(mapStateToProps)(Chatbox);
