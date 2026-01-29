import recordEvent from 'platform/monitoring/record-event';
import { dataDogLogger } from 'platform/monitoring/Datadog';
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
import { decodeHtmlEntities, sendDatadogError } from '../util/helpers';
import { resetRecentRecipient } from './recipients';
import { setThreadRefetchRequired } from './threads';
import { clearPrescription } from './prescription';

const sendSaveDraft = async (messageData, id) => {
  try {
    if (id) {
      return await updateDraft(id, messageData);
    }
    return await createDraft(messageData);
  } catch (error) {
    sendDatadogError(error, 'action_draftDetails_sendSaveDraft');
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
    sendDatadogError(error, 'action_draftDetails_sendReplyDraft');
    return error;
  }
};

/**
 * @param {Object} messageData
 * @param {String} type manual/auto
 * @returns
 */
export const saveDraft = (messageData, type, id) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const redirectPath = state.sm?.prescription?.redirectPath;

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
    if (redirectPath) {
      dataDogLogger({
        message: 'Prescription Renewal Draft Created',
        attributes: {
          recipientId: messageData?.recipientId,
          category: messageData?.category,
        },
        status: 'info',
      });
    }
    dispatch(resetRecentRecipient());
    dispatch(setThreadRefetchRequired(true));
  }
  if (response.errors) {
    const error = response.errors[0];
    dispatch({
      type: Actions.Draft.SAVE_FAILED,
      response: error,
    });
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        error?.title || Constants.Alerts.Message.GET_MESSAGE_ERROR,
      ),
    );
    if (redirectPath) {
      dataDogLogger({
        message: 'Prescription Renewal Draft Error',
        attributes: {
          recipientId: messageData?.recipientId,
          category: messageData?.category,
        },
        status: 'error',
      });
    }
  }
  if (response.ok) {
    dispatch({
      type: Actions.Thread.UPDATE_DRAFT_IN_THREAD,
      payload: {
        messageId: id,
        draftDate: Date.now(),
        ...messageData,
      },
    });
    if (redirectPath) {
      dataDogLogger({
        message: 'Prescription Renewal Draft Updated',
        attributes: {
          recipientId: messageData?.recipientId,
          category: messageData?.category,
        },
        status: 'info',
      });
    }
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
    dispatch(resetRecentRecipient());
    dispatch(setThreadRefetchRequired(true));
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
    dispatch(setThreadRefetchRequired(true));
    dispatch(clearPrescription());
  } catch (e) {
    sendDatadogError(e, 'action_draftDetails_deleteDraft');
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
