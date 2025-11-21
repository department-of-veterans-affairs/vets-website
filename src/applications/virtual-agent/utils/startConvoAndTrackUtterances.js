import {
  processActionConnectFulfilled,
  processSendMessageActivity,
  processIncomingActivity,
  addActivityData,
} from './actions';
import {
  WEB_CHAT_SEND_MESSAGE,
  DIRECT_LINE_POST_ACTIVITY,
  DIRECT_LINE_CONNECT_FULFILLED,
  DIRECT_LINE_INCOMING_ACTIVITY,
} from './actionTypes';

/**
 * Middleware factory for Virtual Agent Web Chat behavior.
 *
 * When `freezeRef.current` is true (e.g., token-expiry alert is open), this
 * middleware blocks outbound activities to preserve the transcript while
 * preventing new messages/events from being sent to the bot. Specifically it
 * blocks:
 * - WEB_CHAT/SEND_MESSAGE
 * - DIRECT_LINE/POST_ACTIVITY
 *
 * The `freezeRef` is a mutable ref passed from useWebChatStore, allowing the
 * UI to toggle blocking without recreating the Redux store or middleware.
 */
const StartConvoAndTrackUtterances = {
  makeBotStartConvoAndTrackUtterances: event => ({
    dispatch,
  }) => next => action => {
    const options = {
      action,
      dispatch,
      ...event,
    };

    // When frozen (expiry alert shown), block outbound send/post actions by returning
    // undefined so the action is not passed to the next middleware/reducer.
    if (
      options.freezeRef &&
      options.freezeRef.current &&
      (action.type === WEB_CHAT_SEND_MESSAGE ||
        action.type === DIRECT_LINE_POST_ACTIVITY)
    ) {
      return undefined;
    }

    const processActionType = {
      [DIRECT_LINE_CONNECT_FULFILLED]: processActionConnectFulfilled(options),
      [DIRECT_LINE_INCOMING_ACTIVITY]: processIncomingActivity(options),
      [WEB_CHAT_SEND_MESSAGE]: processSendMessageActivity(options),
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
