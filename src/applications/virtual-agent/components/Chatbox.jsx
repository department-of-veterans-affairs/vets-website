import React, { useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SignInModal from '@department-of-veterans-affairs/platform-user/SignInModal';
import ChatbotError from './ChatbotError';
import WebChat from './WebChat';
import ChatboxDisclaimer from './ChatboxDisclaimer';
import { COMPLETE, ERROR, LOADING } from '../utils/loadingStatus';
import useWebChat from '../hooks/useWebChat';
import {
  getInAuthExp,
  getLoggedInFlow,
  setInAuthExp,
  setLoggedInFlow,
} from '../utils/sessionStorage';
import useBotOutgoingActivityEventListener from '../hooks/useBotOutgoingActivityEventListener';
import useWebMessageActivityEventListener from '../hooks/useWebMessageActivityEventListener';
import webAuthActivityEventListener from '../event-listeners/webAuthActivityEventListener';

function showBot(
  loggedIn,
  accepted,
  minute,
  isAuthTopic,
  setIsAuthTopic,
  props,
) {
  const inAuthExp = getInAuthExp();
  if (!accepted && !inAuthExp) {
    return <ChatboxDisclaimer />;
  }

  if (!loggedIn && isAuthTopic) {
    return (
      <SignInModal
        visible
        onClose={() => {
          setIsAuthTopic(false);
          setLoggedInFlow('false');
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
  const [chatBotLoadTime] = useState(Date.now());

  webAuthActivityEventListener(isLoggedIn, setIsAuthTopic);

  useBotOutgoingActivityEventListener(chatBotLoadTime);

  useWebMessageActivityEventListener();

  const loggedInFlow = getLoggedInFlow();
  if (loggedInFlow === 'true' && isLoggedIn) {
    setInAuthExp('true');
    setLoggedInFlow('false');
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
  const { token, webChatFramework, loadingStatus, apiSession } = useWebChat(
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
          webChatFramework={webChatFramework}
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
