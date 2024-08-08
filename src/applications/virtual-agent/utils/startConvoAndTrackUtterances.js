import {
  processActionConnectFulfilled,
  processSendMessageActivity,
  processIncomingActivity,
  processMicrophoneActivity,
} from './actions';

function addActivityData(
  action,
  { apiSession, csrfToken, apiURL, userFirstName, userUuid },
) {
  const updatedAction = action;
  if (updatedAction.payload?.activity) {
    updatedAction.payload.activity.value = {
      ...updatedAction.payload.activity.value,
      apiSession,
      csrfToken,
      apiURL,
      userFirstName,
      userUuid,
    };
  }
  return updatedAction;
}

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

    const canProcessAction = processActionType[action.type];
    if (canProcessAction) {
      processActionType[action.type]();
    }

    let updatedAction = action;
    if (event.isRootBotToggleOn) {
      updatedAction = addActivityData(updatedAction, options);
    }

    return next(updatedAction);
  },
};

export default StartConvoAndTrackUtterances;
