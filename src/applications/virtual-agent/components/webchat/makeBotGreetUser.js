import * as _ from 'lodash';
import piiReplace from './piiReplace';
import {
  IN_AUTH_EXP,
  IS_TRACKING_UTTERANCES,
  LOGGED_IN_FLOW,
  RECENT_UTTERANCES,
} from '../chatbox/utils';

function processActionConnectFulfilled(
  requireAuth,
  dispatch,
  csrfToken,
  apiSession,
  apiURL,
  baseURL,
  userFirstName,
  userUuid,
) {
  const joinActivity = {
    type: 'WEB_CHAT/SEND_EVENT',
    payload: {
      name: 'webchat/join',
      value: {
        language: window.navigator.language,
      },
    },
  };
  const startConversationActivity = {
    meta: {
      method: 'keyboard',
    },
    payload: {
      activity: {
        channelData: {
          postBack: true,
        },
        // Web Chat will show the 'Greeting' System Topic message which has a trigger-phrase 'hello'
        name: 'startConversation',
        type: 'event',
        value: {
          csrfToken,
          apiSession,
          apiURL,
          baseURL,
          userFirstName,
          userUuid,
        },
      },
    },
    type: 'DIRECT_LINE/POST_ACTIVITY',
  };
  if (requireAuth && sessionStorage.getItem(LOGGED_IN_FLOW) !== 'true') {
    dispatch(startConversationActivity);
  }
  dispatch(joinActivity);
}

const GreetUser = {
  makeBotGreetUser: (
    csrfToken,
    apiSession,
    apiURL,
    baseURL,
    userFirstName,
    userUuid,
    requireAuth,
  ) => ({ dispatch }) => next => action => {
    if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      processActionConnectFulfilled(
        requireAuth,
        dispatch,
        csrfToken,
        apiSession,
        apiURL,
        baseURL,
        userFirstName,
        userUuid,
      );
    }
    if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      processIncomingActivity(requireAuth, action, dispatch);
    }
    if (action.type === 'WEB_CHAT/SEND_MESSAGE') {
      processSendMessageActivity(action);
    }
    return next(action);
  },
};

function processSendMessageActivity(action) {
  _.assign(action.payload, { text: piiReplace(action.payload.text) });
}

function processIncomingActivity(requireAuth, action, dispatch) {
  if (!requireAuth) return;
  const data = action.payload.activity;

  // if at the beginning of a conversation, start tracking utterances
  if (sessionStorage.getItem(IS_TRACKING_UTTERANCES) == null) {
    sessionStorage.setItem(IS_TRACKING_UTTERANCES, JSON.stringify(true));
  }

  if (data.type === 'message' && data.text) {
    if (
      data.text.includes('Alright. Sending you to the sign in page...') &&
      data.from.role === 'bot'
    ) {
      // if user is redirected to sign in, stop tracking utterances
      sessionStorage.setItem(IS_TRACKING_UTTERANCES, JSON.stringify(false));
      const authEvent = new Event('webchat-auth-activity');
      authEvent.data = action.payload.activity;
      window.dispatchEvent(authEvent);
    } else if (
      data.text.includes('To get started') &&
      data.from.role === 'bot' &&
      sessionStorage.getItem(IN_AUTH_EXP) === 'true'
    ) {
      const UNKNOWN_UTTERANCE = 'unknownUtterance';
      let utterance = UNKNOWN_UTTERANCE;
      let utterances = JSON.parse(sessionStorage.getItem(RECENT_UTTERANCES));
      if (utterances && utterances.length > 0) {
        utterance = utterances[0];
      }
      if (utterance !== UNKNOWN_UTTERANCE) {
        dispatch({
          type: 'WEB_CHAT/SEND_MESSAGE',
          payload: {
            type: 'message',
            text: utterance,
          },
        });
        // Reset utterance store
        utterances = [];
        sessionStorage.setItem(RECENT_UTTERANCES, JSON.stringify(utterances));
      }
    }
    if (JSON.parse(sessionStorage.getItem(IS_TRACKING_UTTERANCES))) {
      const chatEvent = new Event('webchat-message-activity');
      chatEvent.data = action.payload.activity;
      window.dispatchEvent(chatEvent);
    }
  }
}

export default GreetUser;


