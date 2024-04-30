import * as _ from 'lodash';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import piiReplace from './piiReplace';
import {
  getConversationIdKey,
  getInAuthExp,
  getIsRxSkill,
  getIsTrackingUtterances,
  getRecentUtterances,
  setIsRxSkill,
  setIsTrackingUtterances,
  setRecentUtterances,
} from './sessionStorage';
import { sendWindowEventWithActionPayload } from './events';

const START_CONVERSATION = 'startConversation';
const EVENT = 'event';
const POST_ACTIVITY = 'DIRECT_LINE/POST_ACTIVITY';
const SEND_EVENT = 'WEB_CHAT/SEND_EVENT';

const joinActivity = {
  type: SEND_EVENT,
  payload: {
    name: 'webchat/join',
    value: { language: window.navigator.language },
  },
};

function getStartConversationActivity(value) {
  return {
    meta: { method: 'keyboard' },
    payload: {
      activity: {
        channelData: { postBack: true },
        name: START_CONVERSATION,
        type: EVENT,
        value: {
          csrfToken: value.csrfToken,
          apiSession: value.apiSession,
          apiURL: value.apiURL,
          baseURL: value.baseURL,
          userFirstName: value.userFirstName,
          userUuid: value.userUuid,
          currentConversationId: value.currentConversationId,
          isMobile: value.isMobile,
        },
      },
    },
    type: POST_ACTIVITY,
  };
}

function getEventName(action) {
  return action?.payload?.activity?.name ?? '';
}

function getEventValue(action) {
  return action?.payload?.activity?.value ?? '';
}

function isEventRxSkill(eventValue) {
  return eventValue === 'RX_Skill';
}

function handleSkillEvent(action, eventName, isRxSkillState) {
  const actionEventName = getEventName(action);
  const eventValue = getEventValue(action);

  if (actionEventName === eventName && isEventRxSkill(eventValue)) {
    setIsRxSkill(isRxSkillState);
    sendWindowEventWithActionPayload('rxSkill', action);
  }
}

function createSendMessageActivity(newUtterance) {
  return {
    type: 'WEB_CHAT/SEND_MESSAGE',
    payload: { type: 'message', text: newUtterance },
  };
}

function resetUtterances(dispatch) {
  const utterances = getRecentUtterances();
  const utterance = utterances ? utterances[0] : undefined;
  if (utterance) {
    dispatch(createSendMessageActivity(utterance));
    // Reset utterance array
    setRecentUtterances([]);
  }
}

// define thunks for actions
export const processActionConnectFulfilled = ({
  dispatch,
  ...options
}) => () => {
  const currentConversationId = getConversationIdKey();
  const startConversationActivity = getStartConversationActivity({
    ...options,
    currentConversationId,
  });

  dispatch(startConversationActivity);
  dispatch(joinActivity);
};

export const processSendMessageActivity = ({ action }) => () => {
  _.assign(action.payload, { text: piiReplace(action.payload.text) });
  const outgoingActivityEvent = new Event('bot-outgoing-activity');
  window.dispatchEvent(outgoingActivityEvent);
};

export const processIncomingActivity = ({ action, dispatch }) => () => {
  const isAtBeginningOfConversation = !getIsTrackingUtterances();
  const data = action.payload.activity;
  const isMessageFromBot =
    data.type === 'message' && data.text && data.from.role === 'bot';

  if (isAtBeginningOfConversation) {
    setIsTrackingUtterances(true);
  }

  if (isMessageFromBot) {
    const botWantsToSignInUser = data.text.includes(
      'Alright. Sending you to the sign-in page...',
    );

    const inAuthExp = getInAuthExp();
    const isNewAuthedConversation =
      data.text.includes('To get started') && inAuthExp === 'true';

    if (botWantsToSignInUser) {
      setIsTrackingUtterances(false);
      sendWindowEventWithActionPayload('webchat-auth-activity', action);
    } else if (isNewAuthedConversation) {
      resetUtterances(dispatch);
    }
  }

  const trackingUtterances = getIsTrackingUtterances();
  if (trackingUtterances) {
    sendWindowEventWithActionPayload('webchat-message-activity', action);
  }

  handleSkillEvent(action, 'Skill_Entry', true);
  handleSkillEvent(action, 'Skill_Exit', false);
};

export const processMicrophoneActivity = ({ action }) => () => {
  const isRxSkill = getIsRxSkill();
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
