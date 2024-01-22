import {
  processActionConnectFulfilled,
  processSendMessageActivity,
  processIncomingActivity,
  processMicrophoneEnabledActivity,
} from './helpers/startConvoAndTrackUtterancesHelpers';

const StartConvoAndTrackUtterances = {
  makeBotStartConvoAndTrackUtterances: (
    csrfToken,
    apiSession,
    apiURL,
    baseURL,
    userFirstName,
    userUuid,
    isMobile,
  ) => ({ dispatch }) => next => action => {
    const options = {
      action,
      dispatch,
      csrfToken,
      apiSession,
      apiURL,
      baseURL,
      userFirstName,
      userUuid,
      isMobile,
    };

    const processActionType = {
      'DIRECT_LINE/CONNECT_FULFILLED': processActionConnectFulfilled(options),
      'DIRECT_LINE/INCOMING_ACTIVITY': processIncomingActivity(options),
      'WEB_CHAT/SEND_MESSAGE': processSendMessageActivity(options),
      'WEB_CHAT/SET_DICTATE_STATE': processMicrophoneEnabledActivity(options),
    };
    const canProcessAction = processActionType[action.type];
    if (canProcessAction) processActionType[action.type]();
    return next(action);
  },
};

export default StartConvoAndTrackUtterances;
