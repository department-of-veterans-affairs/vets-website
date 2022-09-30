import { Actions } from '../util/actionTypes';
import { getMessageList, getMessage, getMessageHistory } from '../api/SmApi';

/**
 * @param {Long} folderId
 * @param {Boolean} update true if using auto-refresh to prevent messageList redux
 * object from clearing out and triggering spinning circle
 *
 * @returns
 */
export const getMessages = (folderId, { update }) => async dispatch => {
  if (!update) {
    dispatch({ type: Actions.Message.CLEAR_LIST });
  }
  const response = await getMessageList(folderId);
  // TODO Add error handling
  dispatch({
    type: Actions.Message.GET_LIST,
    response,
  });
};

const retrieveMessageHistory = (
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
  }
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
  const response = await getMessage(messageId);
  dispatch(retrieveMessageHistory(messageId, isDraft));
  if (response.errors) {
    // TODO Add error handling
  } else {
    dispatch({
      type: isDraft ? Actions.Draft.GET : Actions.Message.GET,
      response,
    });
  }
};
