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
import { decodeHtmlEntities } from '../util/helpers';

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
  dispatch({ type: Actions.Thread.DRAFT_SAVE_STARTED });

  const request = {
    ...messageData,
    body: decodeHtmlEntities(messageData.body),
    subject: decodeHtmlEntities(messageData.subject),
  };

  const response = await sendSaveDraft(request, id);
  if (response.data) {
    dispatch({
      type: Actions.Draft.CREATE_SUCCEEDED,
      response: {
        data: {
          ...response.data,
          attributes: {
            ...response.data.attributes,
            body: decodeHtmlEntities(response.data.attributes.body),
            subject: decodeHtmlEntities(response.data.attributes.subject),
          },
        },
      },
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
      type: Actions.Thread.UPDATE_DRAFT_IN_THREAD,
      payload: { messageId: id, draftDate: Date.now(), ...messageData },
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

  dispatch({
    type: Actions.Thread.DRAFT_SAVE_STARTED,
    payload: { messageId: id },
  });

  const request = {
    ...messageData,
    body: decodeHtmlEntities(messageData.body),
    subject: decodeHtmlEntities(messageData.subject),
  };

  const response = await sendReplyDraft(replyToId, request, id);
  if (response.data) {
    dispatch({
      type: Actions.Draft.CREATE_SUCCEEDED,
      response: {
        data: {
          ...response.data,
          attributes: {
            ...response.data.attributes,
            body: decodeHtmlEntities(response.data.attributes.body),
            subject: decodeHtmlEntities(response.data.attributes.subject),
          },
        },
      },
    });
    return response.data.attributes;
  }
  if (response.ok) {
    dispatch({
      type: Actions.Thread.UPDATE_DRAFT_IN_THREAD,
      payload: { messageId: id, draftDate: Date.now(), ...messageData },
    });
  }
  if (response.errors) {
    dispatch({
      type: Actions.Draft.SAVE_FAILED,
      payload: { messageId: id },
      response: response.errors[0],
    });
    throw response.errors[0];
  }
  return null;
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
