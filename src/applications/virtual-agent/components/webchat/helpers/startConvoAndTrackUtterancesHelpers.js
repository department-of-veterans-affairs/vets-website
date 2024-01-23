import * as _ from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import {
  joinActivity,
  startConversationActivity,
} from '../../../actions/index';
import piiReplace from '../piiReplace';
import {
  IN_AUTH_EXP,
  IS_TRACKING_UTTERANCES,
  RECENT_UTTERANCES,
  CONVERSATION_ID_KEY,
  IS_RX_SKILL,
} from '../../chatbox/utils';

// define thunks for actions
export const processActionConnectFulfilled = ({
  dispatch,
  csrfToken,
  apiSession,
  apiURL,
  baseURL,
  userFirstName,
  userUuid,
  isMobile,
}) => () => {
  const currentConversationId = sessionStorage.getItem(CONVERSATION_ID_KEY);
  const options = {
    csrfToken,
    apiSession,
    apiURL,
    baseURL,
    userFirstName,
    userUuid,
    currentConversationId,
    isMobile,
  };
  dispatch(startConversationActivity(options));

  dispatch(joinActivity);
};

export const processSendMessageActivity = ({ action }) => () => {
  _.assign(action.payload, { text: piiReplace(action.payload.text) });
  const outgoingActivityEvent = new Event('bot-outgoing-activity');
  window.dispatchEvent(outgoingActivityEvent);
};

export const processIncomingActivity = ({ action, dispatch }) => () => {
  const setSessionStorageAsString = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };
  const stopTrackingUtterances = () => {
    setSessionStorageAsString(IS_TRACKING_UTTERANCES, false);
  };

  const sendWindowEvent = eventType => {
    const event = new Event(eventType);
    event.data = action.payload.activity;
    window.dispatchEvent(event);
  };

  const isAtBeginningOfConversation = !sessionStorage.getItem(
    IS_TRACKING_UTTERANCES,
  );
  const data = action.payload.activity;
  const dataIsMessageWithTextFromBot =
    data.type === 'message' && data.text && data.from.role === 'bot';

  if (isAtBeginningOfConversation) {
    setSessionStorageAsString(IS_TRACKING_UTTERANCES, true);
  }

  if (dataIsMessageWithTextFromBot) {
    const botWantsToSignInUser =
      data.text.includes('Alright. Sending you to the sign in page...') ||
      data.text.includes('Alright. Sending you to the sign-in page...');
    const isNewAuthedConversation =
      data.text.includes('To get started') &&
      sessionStorage.getItem(IN_AUTH_EXP) === 'true';

    if (botWantsToSignInUser) {
      stopTrackingUtterances();

      sendWindowEvent('webchat-auth-activity');
    } else if (isNewAuthedConversation) {
      const utterances = JSON.parse(sessionStorage.getItem(RECENT_UTTERANCES));
      const utterance = utterances ? utterances[0] : undefined;
      const createSendMessageActivity = newUtterance => {
        return {
          type: 'WEB_CHAT/SEND_MESSAGE',
          payload: { type: 'message', text: newUtterance },
        };
      };

      if (utterance) {
        dispatch(createSendMessageActivity(utterance));
        // Reset utterance array
        setSessionStorageAsString(RECENT_UTTERANCES, []);
      }
    }
  }
  if (JSON.parse(sessionStorage.getItem(IS_TRACKING_UTTERANCES))) {
    sendWindowEvent('webchat-message-activity');
  }

  const eventName = action?.payload?.activity?.name ?? '';
  const eventValue = action?.payload?.activity?.value ?? '';

  // use event name for rxSkill
  const skillWasTriggered = eventName === 'Skill_Entry';
  // use event name for rxSkillExit
  const skillWasExited = eventName === 'Skill_Exit';
  // confirm it is the rx skill
  const rxSkill = eventValue === 'RX_Skill';
  if (skillWasTriggered && rxSkill) {
    setSessionStorageAsString(IS_RX_SKILL, true);
    sendWindowEvent('rxSkill');
  }
  if (skillWasExited && rxSkill) {
    setSessionStorageAsString(IS_RX_SKILL, false);
    sendWindowEvent('rxSkill');
  }
};

export const processMicrophoneActivity = ({ action }) => () => {
  const isRxSkill = sessionStorage.getItem(IS_RX_SKILL);
  if (action.payload.dictateState === 3) {
    recordEvent({
      event: 'chatbot-microphone-enable',
      topic: isRxSkill ? 'prescriptions' : undefined,
    });
  } else if (action.payload.dictateState === 0) {
    recordEvent({
      event: 'chatbot-microphone-disable',
      topic: isRxSkill ? 'prescriptions' : undefined,
    });
  }
};
