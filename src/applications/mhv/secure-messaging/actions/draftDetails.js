import { Actions } from '../util/actionTypes';
import { createDraft, updateDraft } from '../api/SmApi';

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
