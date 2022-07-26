import * as _ from 'lodash';
import piiReplace from './piiReplace';
import {
  IN_AUTH_EXP,
  LOGGED_IN_FLOW,
  RECENT_UTTERANCES,
} from '../chatbox/utils';

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
    if (requireAuth) {
      if (
        action.type === 'DIRECT_LINE/CONNECT_FULFILLED' &&
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
    } else {
      // eslint-disable-next-line no-lonely-if
      if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
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
    }

    if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      dispatch({
        type: 'WEB_CHAT/SEND_EVENT',
        payload: {
          name: 'webchat/join',
          value: {
            language: window.navigator.language,
          },
        },
      });
    }

    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (requireAuth) {
      if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
        const data = action.payload.activity;

        if (data.type === 'message' && data.text) {
          if (
            data.text.includes('Alright. Sending you to the sign in page...') &&
            data.from.role === 'bot'
          ) {
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
            let utterances = JSON.parse(
              sessionStorage.getItem(RECENT_UTTERANCES),
            );
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
              sessionStorage.setItem(
                RECENT_UTTERANCES,
                JSON.stringify(utterances),
              );
            }
          } else {
            const chatEvent = new Event('webchat-message-activity');
            chatEvent.data = action.payload.activity;
            window.dispatchEvent(chatEvent);
          }
        }
      }
    }

    if (action.type === 'WEB_CHAT/SEND_MESSAGE') {
      _.assign(action.payload, { text: piiReplace(action.payload.text) });
    }
    return next(action);
  },
};

export default GreetUser;
