import { Actions } from '../util/actionTypes';
import {
  getMessageList,
  getMessage,
  getMessageHistory,
  deleteMessage as deleteMessageCall,
} from '../api/SmApi';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';

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

/**
 * @param {Long} messageId
 * @returns
 */
export const deleteMessage = messageId => async dispatch => {
  try {
    const response = await deleteMessageCall(messageId);
    if (response.errors) {
      // handles errors and dispatch error action
      // fire GA event for error
      const error = response.errors[0];
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          `Message was not successfully deleted.${error && ` Error: ${error}`}`,
        ),
      );
    } else {
      // dispatch success action and GA event
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_SUCCESS,
          '',
          'Message was successfully moved to Trash',
        ),
      );
    }
  } catch (err) {
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        `Message was not successfully deleted.${err && ` Error: ${err}`}`,
      ),
    );
    throw new Error();
  }
};
