import recordEvent from 'platform/monitoring/record-event';
import { Actions } from '../util/actionTypes';
import {
  createDraft,
  deleteMessage,
  updateDraft,
  createReplyDraft,
  updateReplyDraft,
} from '../api/SmApi';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';

const sendSaveDraft = async (messageData, id) => {
  try {
    if (id) {
      return await updateDraft(id, messageData);
    }
    return await createDraft(messageData);
  } catch (error) {
    return error;
  }
};

const sendReplyDraft = async (replyToId, messageData, id) => {
  try {
    if (id) {
      return await updateReplyDraft(replyToId, id, messageData);
    }
    return await createReplyDraft(replyToId, messageData);
  } catch (error) {
    return error;
  }
};

/**
 * @param {Object} messageData
 * @param {String} type manual/auto
 * @returns
 */
export const saveDraft = (messageData, type, id) => async dispatch => {
  recordEvent({
    // For Google Analytics
    event: 'secure-messaging-save-draft-type',
    'secure-messaging-save-draft': type,
    'secure-messaging-save-draft-id': id,
  });
  if (type === 'auto') dispatch({ type: Actions.Draft.AUTO_SAVE_STARTED });
  else if (type === 'manual') dispatch({ type: Actions.Draft.SAVE_STARTED });

  const response = await sendSaveDraft(messageData, id);
  if (response.data) {
    dispatch({
      type: Actions.Draft.CREATE_SUCCEEDED,
      response,
    });
  }
  if (response.errors) {
    const error = response.errors[0];
    dispatch({
      type: Actions.Draft.SAVE_FAILED,
      response: error,
    });
  }
  if (response.ok) {
    dispatch({
      type: Actions.Draft.UPDATE_SUCCEEDED,
      response: messageData,
    });
  }
};

/**
 * @param {Object} messageData
 * @param {String} type manual/auto
 * @returns
 */
export const saveReplyDraft = (
  replyToId,
  messageData,
  type,
  id,
) => async dispatch => {
  recordEvent({
    // For Google Analytics
    event: 'secure-messaging-save-draft-type',
    'secure-messaging-save-draft': type,
    'secure-messaging-save-draft-id': id,
  });

  if (type === 'auto') dispatch({ type: Actions.Draft.AUTO_SAVE_STARTED });
  else if (type === 'manual') dispatch({ type: Actions.Draft.SAVE_STARTED });

  const response = await sendReplyDraft(replyToId, messageData, id);
  if (response.data) {
    dispatch({
      type: Actions.Draft.CREATE_SUCCEEDED,
      response,
    });
    return response.data.attributes;
  }
  if (response.ok) {
    dispatch({
      type: Actions.Draft.UPDATE_SUCCEEDED,
      response: messageData,
    });
  }
  if (response.errors) {
    dispatch({
      type: Actions.Draft.SAVE_FAILED,
      response: response.errors[0],
    });
    throw response.errors[0];
  }
  return null;
};

export const clearDraft = () => dispatch => {
  dispatch({ type: Actions.Draft.CLEAR_DRAFT });
};

/**
 * @param {Long} messageId
 * @returns
 */
export const deleteDraft = messageId => async dispatch => {
  try {
    await deleteMessage(messageId);
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Message.DELETE_DRAFT_SUCCESS,
      ),
    );
    dispatch(clearDraft());
  } catch (e) {
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        Constants.Alerts.Message.DELETE_DRAFT_ERROR,
      ),
    );
    throw e;
  }
};
