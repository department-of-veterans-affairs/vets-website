import * as _ from 'lodash';
import piiReplace from './piiReplace';
import {
  IN_AUTH_EXP,
  IS_TRACKING_UTTERANCES,
  LOGGED_IN_FLOW,
  RECENT_UTTERANCES,
} from '../chatbox/utils';

const UNKNOWN_UTTERANCE = 'unknownUtterance';

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

function processSendMessageActivity(action) {
  _.assign(action.payload, { text: piiReplace(action.payload.text) });
}

function processIncomingActivity(requireAuth, action, dispatch) {
  const setSessionStorageAsString = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };
  const authIsNotRequired = !requireAuth;
  const isAtBeginningOfConversation = !sessionStorage.getItem(
    IS_TRACKING_UTTERANCES,
  );

  if (authIsNotRequired) return;
  const data = action.payload.activity;

  // if at the beginning of a conversation, start tracking utterances
  if (isAtBeginningOfConversation) {
    setSessionStorageAsString(IS_TRACKING_UTTERANCES, true);
  }

  if (data.type === 'message' && data.text) {
    if (
      data.text.includes('Alright. Sending you to the sign in page...') &&
      data.from.role === 'bot'
    ) {
      // if user is redirected to sign in, stop tracking utterances
      setSessionStorageAsString(IS_TRACKING_UTTERANCES, false);
      const authEvent = new Event('webchat-auth-activity');
      authEvent.data = action.payload.activity;
      window.dispatchEvent(authEvent);
    } else if (
      data.text.includes('To get started') &&
      data.from.role === 'bot' &&
      sessionStorage.getItem(IN_AUTH_EXP) === 'true'
    ) {
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
        setSessionStorageAsString(RECENT_UTTERANCES, utterances);
      }
    }
    if (JSON.parse(sessionStorage.getItem(IS_TRACKING_UTTERANCES))) {
      const chatEvent = new Event('webchat-message-activity');
      chatEvent.data = action.payload.activity;
      window.dispatchEvent(chatEvent);
    }
  }
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
    // create thunks
    const connectFulfilledThunk = () =>
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

    const incomingActivityThunk = () =>
      processIncomingActivity(requireAuth, action, dispatch);

    const sendMessageThunk = () => processSendMessageActivity(action);
    // add thunks to an obj
    const processActionType = {
      'DIRECT_LINE/CONNECT_FULFILLED': connectFulfilledThunk,
      'DIRECT_LINE/INCOMING_ACTIVITY': incomingActivityThunk,
      'WEB_CHAT/SEND_MESSAGE': sendMessageThunk,
    };

    const canProcessAction = processActionType[action.type];
    if (canProcessAction) processActionType[action.type]();
    return next(action);
  },
};

export default GreetUser;
