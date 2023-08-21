import * as _ from 'lodash';
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
    const botWantsToSignInUser = data.text.includes(
      'Alright. Sending you to the sign in page...',
    );
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
  const payload = action.payload || {};
  const dataorEmpty = payload.activity || {};
  const text = dataorEmpty.text || '';
  const rxSkillWasTriggered = text.includes(
    'You are now in the Prescriptions Bot.',
  );
  const rxSkillWasExited = text.includes('Returning to the main chatbot...');

  if (rxSkillWasTriggered) {
    setSessionStorageAsString(IS_RX_SKILL, true);
    sendWindowEvent('rxSkill');
    // window.dispatchEvent(new Event('rxSkill'));
  }
  if (rxSkillWasExited) {
    setSessionStorageAsString(IS_RX_SKILL, false);
    sendWindowEvent('rxSkill');
  }
};
