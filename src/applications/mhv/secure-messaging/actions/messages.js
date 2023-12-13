import { Actions } from '../util/actionTypes';
import {
  getMessage,
  deleteMessageThread as deleteMessageCall,
  moveMessageThread as moveThreadCall,
  createMessage,
  createReplyToMessage,
  getMessageThread,
} from '../api/SmApi';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';
import { getLastSentMessage, isOlderThan } from '../util/helpers';

export const clearThread = () => async dispatch => {
  dispatch({ type: Actions.Thread.CLEAR_THREAD });
};

/**
 * @param {Long} messageId
 * @returns
 */
export const markMessageAsReadInThread = messageId => async dispatch => {
  const response = await getMessage(messageId);
  if (response.errors) {
    // TODO Add error handling
  } else {
    dispatch({
      type: Actions.Thread.GET_MESSAGE_IN_THREAD,
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
export const retrieveMessageThread = messageId => async dispatch => {
  try {
    dispatch(clearThread());
    const response = await getMessageThread(messageId);
    const msgResponse = await getMessage(response.data[0].attributes.messageId);
    if (msgResponse.errors) {
      dispatch(
        addAlert(Constants.ALERT_TYPE_ERROR, '', msgResponse.errors[0]?.detail),
      );
    } else {
      // finding last sent message in a thread to check if it is not too old for replies
      const lastSentDate = getLastSentMessage(response.data)?.attributes
        .sentDate;

      const drafts = response.data.filter(m => m.attributes.draftDate !== null);
      const messages = response.data.filter(
        m => m.attributes.sentDate !== null,
      );
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

      const fullDrafts = async () => {
        if (drafts?.length) {
          const arr = await Promise.all(
            drafts.map(async m => {
              const fullDraft = await getMessage(m.attributes.messageId);
              return { ...m.attributes, ...fullDraft.data.attributes };
            }),
          );
          arr.sort((a, b) => {
            const dateA = new Date(a.draftDate);
            const dateB = new Date(b.draftDate);

            return dateB - dateA;
          });
          return arr;
        }
        return undefined;
      };

      const fullDraftsArr = await fullDrafts();

      dispatch({
        type: Actions.Thread.GET_THREAD,
        payload: {
          replyToName,
          threadFolderId,
          cannotReply: isOlderThan(lastSentDate, 45),
          replyToMessageId: msgResponse.data.attributes.messageId,
          drafts: fullDraftsArr,
          messages: messages.map(m => m.attributes),
        },
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
        e.errors[0].code === Constants.Errors.Code.BLOCKED_USER2)
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
    } else if (
      e.errors &&
      e.errors[0].code === Constants.Errors.Code.TG_NOT_ASSOCIATED
    ) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR, '', e.errors[0].detail));
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
