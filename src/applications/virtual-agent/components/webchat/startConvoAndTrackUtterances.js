import {
  processActionConnectFulfilled,
  processSendMessageActivity,
  processIncomingActivity,
} from './helpers/startConvoAndTrackUtterancesHelpers';

const StartConvoAndTrackUtterances = {
  makeBotStartConvoAndTrackUtterances: (
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

export default StartConvoAndTrackUtterances;
