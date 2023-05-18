import React, { useState, useEffect } from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { useSelector } from 'react-redux';
import SignInModal from 'platform/user/authentication/components/SignInModal';
import ChatbotError from '../chatbot-error/ChatbotError';
import useWebChatFramework from './useWebChatFramework';
import useVirtualAgentToken from './useVirtualAgentToken';
import WebChat from '../webchat/WebChat';
import ChatboxDisclaimer, {
  ChatboxDisclaimerForSkills,
} from './ChatboxDisclaimer';
import {
  combineLoadingStatus,
  COMPLETE,
  ERROR,
  LOADING,
} from './loadingStatus';
import { storeUtterances, LOGGED_IN_FLOW, IN_AUTH_EXP } from './utils';

// const ONE_MINUTE_IN_MS = 60_000;

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
    skillName: props.currentSkillName,
  };
}

function showBot(
  loggedIn,
  accepted,
  acceptedSkill,
  minute,
  isAuthTopic,
  setIsAuthTopic,
  props,
) {
  if (!accepted && !sessionStorage.getItem(IN_AUTH_EXP)) {
    return <ChatboxDisclaimer />;
  }

  if (!acceptedSkill && !sessionStorage.getItem(IN_AUTH_EXP)) {
    // return <ChatboxDisclaimerForSkills skillName={props.currentSkillName} />;
    return <ChatboxDisclaimerForSkills skillName="Rx Skill" />;
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

  return <App timeout={props.timeout || minute} skillName="Joe's Skill" />;
}

export default function Chatbox(props) {
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);
  const isAccepted = useSelector(state => state.virtualAgentData.termsAccepted);
  const isAcceptedSkill = useSelector(state => state.virtualAgentData.termsAcceptedSkill);
  const currentSkillName = useSelector(state => state.virtualAgentData.currentSkillName);
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

  const foo = event => {
    // console.log('message activity event fired!');
    // console.log(JSON.stringify(event, null, 2));
    // console.log('event name: ' + event.data.name);
    if (event.data.name === 'startConversation') {

      if (currentSkillName) {
        document
          .querySelectorAll('div.virtual-agent-header')[0]
          .classList.add('vads-u-background-color--secondary-darkest');
        document.querySelectorAll('div.virtual-agent-header h2')[0].textContent = `VA chatbot: ${currentSkillName} (beta)`;
        document.querySelectorAll('.webchat__send-box-text-box__input')[0].placeholder = `Type your message for ${currentSkillName.toLowerCase()}`;
      } else {
        document
          .querySelectorAll('div.virtual-agent-header')[0]
          .classList.add('vads-u-background-color--primary-darkest');
        document.querySelectorAll('div.virtual-agent-header h2')[0].textContent = 'VA chatbot (beta)';
        document.querySelectorAll('.webchat__send-box-text-box__input')[0].placeholder = 'Type your message';
      }
    }
    storeUtterances(event);
  };

  useEffect(() => {
    // initiate the event handler
    window.addEventListener('webchat-message-activity', foo); // storeUtterances);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener('webchat-message-activity', foo); // storeUtterances);
    };
  });

  if (sessionStorage.getItem(LOGGED_IN_FLOW) === 'true' && isLoggedIn) {
    sessionStorage.setItem(IN_AUTH_EXP, 'true');
    sessionStorage.setItem(LOGGED_IN_FLOW, 'false');
  }

  const ONE_MINUTE = 60 * 1000;
  return (
    <div className="virtual-agent-container vads-u-padding--1p5 vads-u-background-color--gray-lightest">
      <div className="virtual-agent-header vads-u-background-color--primary-darkest vads-u-padding--1p5">
        <h2 className="vads-u-font-size--lg vads-u-color--white vads-u-margin--0">
          VA chatbot (beta)
        </h2>
      </div>
      <div className='webchat-virtual-agent-breadcrumbs'>
        VA chatbot<span className="webchat-virtual-agent-skill-name-container"> &raquo; <span className="webchat-virtual-agent-skill-name">{ currentSkillName }</span></span>
      </div>
      {showBot(
        isLoggedIn,
        isAccepted,
        isAcceptedSkill,
        ONE_MINUTE,
        isAuthTopic,
        setIsAuthTopic,
        props,
      )}
    </div>
  );
}

function App(props) {
  const { token, WebChatFramework, loadingStatus, apiSession, skillName } = useWebChat(
    props,
  );

  switch (loadingStatus) {
    case ERROR:
      return <ChatbotError />;
    case LOADING:
      return <LoadingIndicator message="Loading Chatbot" />;
    case COMPLETE:
      return (
        <WebChat
          token={token}
          WebChatFramework={WebChatFramework}
          apiSession={apiSession}
          skillName={skillName}
        />
      );
    default:
      throw new Error(`Invalid loading status: ${loadingStatus}`);
  }
}
