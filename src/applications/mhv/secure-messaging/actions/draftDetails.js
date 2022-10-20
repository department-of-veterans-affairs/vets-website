import { Actions } from '../util/actionTypes';
import { createDraft, deleteMessage, updateDraft } from '../api/SmApi';
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

/**
 * @param {Object} messageData
 * @param {String} type manual/auto
 * @returns
 */
export const saveDraft = (messageData, type, id) => async dispatch => {
  if (type === 'auto') dispatch({ type: Actions.Draft.AUTO_SAVE_STARTED });
  else if (type === 'manual') dispatch({ type: Actions.Draft.SAVE_STARTED });

  const response = await sendSaveDraft(messageData, id);
  if (response.errors) {
    const error = response.errors[0];
    dispatch({
      type: Actions.Draft.SAVE_FAILED,
      response: error,
    });
  } else if (id) {
    dispatch({
      type: Actions.Draft.UPDATE_SUCCEEDED,
      response,
    });
  } else {
    dispatch({
      type: Actions.Draft.CREATE_SUCCEEDED,
      response,
    });
  }
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
    // const error = e.errors[0].detail;
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
