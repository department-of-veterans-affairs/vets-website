import { Actions } from '../util/actionTypes';
import { createDraft, updateDraft } from '../api/SmApi';

const sendSaveDraft = async (messageData, id) => {
  try {
    const messageJSON = JSON.stringify(messageData);
    if (id) {
      return await updateDraft(messageJSON);
    }
    return await createDraft(messageJSON);
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
  } else {
    dispatch({
      type: Actions.Draft.SAVE_SUCCEEDED,
      response,
    });
  }
};
