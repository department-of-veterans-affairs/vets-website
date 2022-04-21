import * as _ from 'lodash';
import piiReplace from './piiReplace';
import { IN_AUTH_EXP, LOGGED_IN_FLOW, RECENT_UTTERANCES, COUNTER_KEY } from '../chatbox/utils';
// import { useEffect } from 'react';

const GreetUser = {
  makeBotGreetUser: (
    csrfToken,
    apiSession,
    apiURL,
    baseURL,
    userFirstName,
    userUuid,
  ) => ({ dispatch }) => next => action => {
    console.log(sessionStorage.getItem(COUNTER_KEY));
    // if(sessionStorage.getItem('InWebchatJoin') === null) sessionStorage.setItem('InWebchatJoin', 'false');
    // if(sessionStorage.getItem('InResendUtterance') === null) sessionStorage.setItem('InResendUtterance', 'false');

    if (
      action.type === 'DIRECT_LINE/CONNECT_FULFILLED' &&
      // sessionStorage.getItem(IN_AUTH_EXP) !== 'true' // &&
      sessionStorage.getItem(LOGGED_IN_FLOW) !== 'true'
    ) {
      dispatch({
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
      });
    }

    if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const data = action.payload.activity;
      if (data.type === 'message' && data.text) {
        if (
          data.text.includes(
            'Please wait a moment. Sending you to sign in...',
          ) &&
          data.from.role === 'bot'
        ) {
          const authEvent = new Event('webchat-auth-activity');
          authEvent.data = action.payload.activity;
          window.dispatchEvent(authEvent);
        } else {
          const chatEvent = new Event('webchat-message-activity');
          chatEvent.data = action.payload.activity;
          window.dispatchEvent(chatEvent);
        }
      }
    }

    if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      setTimeout(function() {
        dispatch({
          type: 'WEB_CHAT/SEND_EVENT',
          payload: {
            name: 'webchat/join',
            value: {
              language: window.navigator.language,
            },
          },
        });
        sessionStorage.setItem('InWebchatJoin', 'true');
      }, 1000);
    }

    if (
      action.type === 'DIRECT_LINE/CONNECT_FULFILLED' &&
      sessionStorage.getItem(IN_AUTH_EXP) === 'true' // &&
      // sessionStorage.getItem(LOGGED_IN_FLOW) === 'true'
    ) {
      const UNKNOWN_UTTERANCE = 'unknownUtterance';
      let utterance = UNKNOWN_UTTERANCE;
      const utterances = JSON.parse(sessionStorage.getItem(RECENT_UTTERANCES));
      if (utterances && utterances.length > 0) {
        utterance = utterances[0];
      }
      if (utterance !== UNKNOWN_UTTERANCE) {
        sessionStorage.setItem(IN_AUTH_EXP, 'false');
        setTimeout(function() {
          // sessionStorage.setItem(IN_AUTH_EXP, 'false');
          // sessionStorage.setItem(LOGGED_IN_FLOW, 'false');
          // sessionStorage.setItem(COUNTER_KEY, 2);
          dispatch({
            type: 'WEB_CHAT/SEND_MESSAGE',
            payload: {
              type: 'message',
              text: utterance,
            },
          });
          sessionStorage.setItem('InResendUtterance', 'true');
        }, 2000);
      }
    }

    if (action.type === 'WEB_CHAT/SEND_MESSAGE') {
      _.assign(action.payload, { text: piiReplace(action.payload.text) });
    }
    return next(action);
  },
};

export default GreetUser;
