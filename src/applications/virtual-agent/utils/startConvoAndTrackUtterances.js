import {
  processActionConnectFulfilled,
  processSendMessageActivity,
  processIncomingActivity,
  processMicrophoneActivity,
  processPostActivity,
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
      'WEB_CHAT/SET_DICTATE_STATE': processMicrophoneActivity(options),
    };

    if (event.isRootBotToggleOn) {
      processActionType['DIRECT_LINE/POST_ACTIVITY'] = processPostActivity(
        options,
      );
    }

    const canProcessAction = processActionType[action.type];
    if (canProcessAction) {
      const response = processActionType[action.type]();
      return next(response);
    }
    return next(action);
  },
};

export default StartConvoAndTrackUtterances;
