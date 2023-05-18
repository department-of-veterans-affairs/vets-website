export const ACCEPTED = 'ACCEPTED';
export const ACCEPTED_SKILL = 'ACCEPTED_SKILL';
const START_CONVERSATION = 'startConversation';
const EVENT = 'event';
const POST_ACTIVITY = 'DIRECT_LINE/POST_ACTIVITY';
const SEND_EVENT = 'WEB_CHAT/SEND_EVENT';

export const acceptedDisclaimer = {
  type: ACCEPTED,
};

export const acceptedDisclaimerForSkill = {
  type: ACCEPTED_SKILL,
};

export const startConversationActivity = ({
  csrfToken,
  apiSession,
  apiURL,
  baseURL,
  userFirstName,
  userUuid,
  currentConversationId,
}) => {
  return {
    meta: { method: 'keyboard' },
    payload: {
      activity: {
        channelData: { postBack: true },
        name: START_CONVERSATION,
        type: EVENT,
        value: {
          csrfToken,
          apiSession,
          apiURL,
          baseURL,
          userFirstName,
          userUuid,
          currentConversationId,
        },
      },
    },
    type: POST_ACTIVITY,
  };
};

export const joinActivity = {
  type: SEND_EVENT,
  payload: {
    name: 'webchat/join',
    value: { language: window.navigator.language },
  },
};

// TODO RX: Set placeholder text
export const setSendBoxPromptActivity = {
  type: 'WEB_CHAT/SET_SEND_BOX',
  payload: { text: 'Type your Rx question here.' },
};
