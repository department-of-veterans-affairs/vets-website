import {
  processActionConnectFulfilled,
  processSendMessageActivity,
  processIncomingActivity,
  addActivityData,
} from './actions';

const StartConvoAndTrackUtterances = {
  makeBotStartConvoAndTrackUtterances: event => ({
    dispatch,
  }) => next => action => {
    const options = {
      action,
      dispatch,
      ...event,
    };

    const processActionType = {
      'DIRECT_LINE/CONNECT_FULFILLED': processActionConnectFulfilled(options),
      'DIRECT_LINE/INCOMING_ACTIVITY': processIncomingActivity(options),
      'WEB_CHAT/SEND_MESSAGE': processSendMessageActivity(options),
    };

    const canProcessAction = processActionType[action.type];
    if (canProcessAction) {
      processActionType[action.type]();
    }

    const updatedAction = addActivityData(action, options);

    return next(updatedAction);
  },
};

export default StartConvoAndTrackUtterances;
