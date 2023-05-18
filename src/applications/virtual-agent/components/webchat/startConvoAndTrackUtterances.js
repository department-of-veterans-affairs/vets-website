import {
  processActionConnectFulfilled,
  processSendMessageActivity,
  processIncomingActivity,
//  processSetPlaceholderTextActivity,
} from './helpers/startConvoAndTrackUtterancesHelpers';

const StartConvoAndTrackUtterances = {
  makeBotStartConvoAndTrackUtterances: (
    csrfToken,
    apiSession,
    skillName,
    apiURL,
    baseURL,
    userFirstName,
    userUuid,
  ) => ({ dispatch }) => next => action => {
    const options = {
      action,
      dispatch,
      csrfToken,
      apiSession,
      skillName,
      apiURL,
      baseURL,
      userFirstName,
      userUuid,
    };

    // TODO RX: are these the only activities we track?
    const processActionType = {
      'DIRECT_LINE/CONNECT_FULFILLED': processActionConnectFulfilled(options),
      'DIRECT_LINE/INCOMING_ACTIVITY': processIncomingActivity(options),
      'WEB_CHAT/SEND_MESSAGE': processSendMessageActivity(options),
//      'WEB_CHAT/SET_SEND_BOX': processSetPlaceholderTextActivity(options),
    };

    const canProcessAction = processActionType[action.type];
    if (canProcessAction) processActionType[action.type]();
    return next(action);
  },
};

export default StartConvoAndTrackUtterances;
