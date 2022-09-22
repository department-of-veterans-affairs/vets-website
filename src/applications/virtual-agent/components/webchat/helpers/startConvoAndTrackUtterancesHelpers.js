import * as _ from 'lodash';
import {
  joinActivity,
  startConversationActivity,
} from '../../../actions/index';
import piiReplace from '../piiReplace';
import {
  IN_AUTH_EXP,
  IS_TRACKING_UTTERANCES,
  LOGGED_IN_FLOW,
  RECENT_UTTERANCES,
} from '../../chatbox/utils';

// define thunks for actions
export const processActionConnectFulfilled = ({
  requireAuth,
  dispatch,
  csrfToken,
  apiSession,
  apiURL,
  baseURL,
  userFirstName,
  userUuid,
}) => () => {
  if (requireAuth && sessionStorage.getItem(LOGGED_IN_FLOW) !== 'true') {
    dispatch(
      startConversationActivity(
        csrfToken,
        apiSession,
        apiURL,
        baseURL,
        userFirstName,
        userUuid,
      ),
    );
  }
  dispatch(joinActivity);
};

export const processSendMessageActivity = ({ action }) => () => {
  _.assign(action.payload, { text: piiReplace(action.payload.text) });
};

export const processIncomingActivity = ({ action, dispatch }) => () => {
  const setSessionStorageAsString = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };
  const stopTrackingUtterances = () => {
    setSessionStorageAsString(IS_TRACKING_UTTERANCES, false);
  };

  const initiateSignIn = () => {
    const authEvent = new Event('webchat-auth-activity');
    authEvent.data = action.payload.activity;
    window.dispatchEvent(authEvent);
  };

  const isAtBeginningOfConversation = !sessionStorage.getItem(
    IS_TRACKING_UTTERANCES,
  );
  const data = action.payload.activity;
  const dataIsMessageWithTextFromBot =
    data.type === 'message' && data.text && data.from.role === 'bot';

  // if at the beginning of a conversation, start tracking utterances
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
      // if user is redirected to sign in, stop tracking utterances
      stopTrackingUtterances();
      initiateSignIn();
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
    if (JSON.parse(sessionStorage.getItem(IS_TRACKING_UTTERANCES))) {
      const chatEvent = new Event('webchat-message-activity');
      chatEvent.data = action.payload.activity;
      window.dispatchEvent(chatEvent);
    }
  }
};
