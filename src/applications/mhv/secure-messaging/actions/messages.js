import { Actions } from '../util/actionTypes';
import {
  getMessageList,
  getMessage,
  getMessageHistory,
  deleteMessageThread as deleteMessageCall,
  moveMessageThread as moveThreadCall,
  createMessage,
  createReplyToMessage,
  getMessageThread,
} from '../api/SmApi';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';
import { getLastSentMessage, isOlderThan } from '../util/helpers';

export const oldMessageAlert = sentDate => dispatch => {
  dispatch({
    type: Actions.Message.CANNOT_REPLY_ALERT,
    payload: isOlderThan(sentDate, 45),
  });
};

/**
 * @param {Long} folderId
 * @param {Boolean} update true if using auto-refresh to prevent messageList redux
 * object from clearing out and triggering spinning circle
 *
 * @returns
 */
export const getMessages = (folderId, update = false) => async dispatch => {
  if (!update) {
    dispatch({ type: Actions.Message.CLEAR_LIST });
  }
  try {
    const response = await getMessageList(folderId);
    dispatch({
      type: Actions.Message.GET_LIST,
      response,
    });
  } catch (e) {
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        Constants.Alerts.Message.GET_MESSAGE_ERROR,
      ),
    );
  }
};

export const retrieveMessageHistory = (
  messageId,
  isDraft = false,
) => async dispatch => {
  const response = await getMessageHistory(messageId);
  if (response.errors) {
    // TODO Add error handling
  } else {
    dispatch({
      type: isDraft ? Actions.Draft.GET_HISTORY : Actions.Message.GET_HISTORY,
      response,
    });

    // Info handling for old messages
    // Update to use new response.data in draftsDetails later
    const { attributes } = response.data?.length > 0 && response.data[0];
    if (attributes) {
      dispatch(oldMessageAlert(attributes.sentDate));
    }
  }
};

export const clearMessageHistory = () => async dispatch => {
  dispatch({ type: Actions.Message.CLEAR_HISTORY });
};

export const clearMessage = () => async dispatch => {
  dispatch({ type: Actions.Message.CLEAR });
};

/**
 * @param {Long} messageId
 * @param {Boolean} isDraft true if the message is a draft, otherwise false
 * @returns
 */
export const retrieveMessage = (
  messageId,
  isDraft = false,
) => async dispatch => {
  dispatch(clearMessage());
  const response = await getMessage(messageId);
  dispatch(retrieveMessageHistory(messageId, isDraft));
  if (response.errors) {
    // TODO Add error handling
    // TODO What happens if a message is requested on the draft page but it has already been sent and is no longer a draft?
  } else {
    dispatch({
      type: isDraft ? Actions.Draft.GET : Actions.Message.GET,
      response,
    });
  }

  // Info handling for old messages
  const { sentDate } = response.data.attributes;
  dispatch(oldMessageAlert(sentDate));
};

/**
 * @param {Long} messageId
 * @returns
 */
export const markMessageAsRead = messageId => async () => {
  const response = await getMessage(messageId);
  if (response.errors) {
    // TODO Add error handling
  }
};

/**
 * @param {Long} messageId
 * @returns
 */
export const markMessageAsReadInThread = (
  messageId,
  isDraftThread,
) => async dispatch => {
  const response = await getMessage(messageId);
  if (response.errors) {
    // TODO Add error handling
  } else {
    dispatch({
      type: isDraftThread
        ? Actions.Draft.GET_IN_THREAD
        : Actions.Message.GET_IN_THREAD,
      response,
    });
  }
};

/**
 * Retrieves a message thread, and sends getMessage call to fill the most recent messasge in the thread with more context
 * such as full body text, attachments, etc.
 * @param {Long} messageId
 * @param {Boolean} isDraft true if the message is a draft, otherwise false
 * @param {Boolean} refresh true if the refreshing a thread on a current view, to avoid clearing redux state and triggering spinning circle
 * @returns
 */
export const retrieveMessageThread = (
  messageId,
  refresh = false,
) => async dispatch => {
  if (!refresh) {
    dispatch(clearMessage());
  }
  try {
    const response = await getMessageThread(messageId);
    const msgResponse = await getMessage(response.data[0].attributes.messageId);
    if (!msgResponse.errors) {
      // finding last sent message in a thread to check if it is not too old for replies
      const lastSentDate = getLastSentMessage(response.data)?.attributes
        .sentDate;
      dispatch(oldMessageAlert(lastSentDate));

      const isDraft = response.data[0].attributes.draftDate !== null;
      const replyToName =
        response.data
          .find(
            m => m.attributes.triageGroupName !== m.attributes.recipientName,
          )
          ?.attributes.senderName.trim() ||
        response.data[0].attributes.triageGroupName;

      const threadFolderId =
        response.data
          .find(
            m => m.attributes.triageGroupName !== m.attributes.recipientName,
          )
          ?.attributes.folderId.toString() ||
        response.data[0].attributes.folderId;

      dispatch({
        type: isDraft ? Actions.Draft.GET : Actions.Message.GET,
        response: {
          data: {
            replyToName,
            threadFolderId,
            replyToMessageId: msgResponse.data.attributes.messageId,
            attributes: {
              ...response.data[0].attributes,
              ...msgResponse.data.attributes,
            },
          },
          included: msgResponse.included,
        },
      });
      dispatch({
        type: isDraft ? Actions.Draft.GET_HISTORY : Actions.Message.GET_HISTORY,
        response: { data: response.data.slice(1, response.data.length) },
      });
    }
  } catch (e) {
    const errorMessage =
      e.errors[0].status === '404'
        ? Constants.Alerts.Thread.THREAD_NOT_FOUND_ERROR
        : e.errors[0]?.detail;
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, '', errorMessage));
    throw e;
  }
};

/**
 * @param {Long} threadId
 *  * @param {Long} folderId
 * @returns
 */
export const deleteMessage = threadId => async dispatch => {
  try {
    await deleteMessageCall(threadId);
    dispatch({ type: Actions.Message.DELETE_SUCCESS });
  } catch (e) {
    // const error = e.errors[0].detail;
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        Constants.Alerts.Message.DELETE_MESSAGE_ERROR,
      ),
    );
    throw e;
  }
};

/**
 * @param {Long} threadId
 * @param {Long} folderId
 * @returns
 */
export const moveMessageThread = (threadId, folderId) => async dispatch => {
  dispatch({ type: Actions.Message.MOVE_REQUEST });
  try {
    await moveThreadCall(threadId, folderId);
    dispatch({ type: Actions.Message.MOVE_SUCCESS });
  } catch (e) {
    dispatch({ type: Actions.Message.MOVE_FAILED });
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        Constants.Alerts.Message.MOVE_MESSAGE_THREAD_ERROR,
      ),
    );
    throw e;
  }
};

export const sendMessage = (message, attachments) => async dispatch => {
  try {
    await createMessage(message, attachments);
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Message.SEND_MESSAGE_SUCCESS,
      ),
    );
  } catch (e) {
    if (
      e.errors &&
      (e.errors[0].code === Constants.Errors.Code.BLOCKED_USER ||
        e.errors[0].code === Constants.Errors.code.BLOCKED_USER2)
    ) {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Message.BLOCKED_MESSAGE_ERROR,
        ),
      );
    } else
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Message.SEND_MESSAGE_ERROR,
        ),
      );
    throw e;
  }
};

/** when sending a reply with an existing draft message, same draft message id is passed as a param query and in the body of the request
 * @param {Long} replyToId - the id of the message being replied to. If replying with a saved draft, this is the id of the draft message
 * @param {Object} message - contains "body" field. Add "draft_id" field if replying with a saved draft and pass messageId of the same draft message
 */

export const sendReply = (
  replyToId,
  message,
  attachments,
) => async dispatch => {
  try {
    await createReplyToMessage(replyToId, message, attachments);
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Message.SEND_MESSAGE_SUCCESS,
      ),
    );
  } catch (e) {
    if (
      e.errors &&
      (e.errors[0].code === Constants.Errors.Code.BLOCKED_USER ||
        e.errors[0].code === Constants.Errors.Code.BLOCKED_USER2)
    ) {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Message.BLOCKED_MESSAGE_ERROR,
        ),
      );
    } else {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Message.SEND_MESSAGE_ERROR,
        ),
      );
    }
    throw e;
  }
};
