import { Actions } from '../util/actionTypes';
import { getMessageList, getMessage } from '../api/SmApi';

export const getMessages = folderId => async dispatch => {
  const response = await getMessageList(folderId);
  // TODO Add error handling
  dispatch({
    type: Actions.Message.GET_LIST,
    response,
  });
};

export const retrieveMessage = messageId => async dispatch => {
  const response = await getMessage(messageId);
  // TODO Add error handling
  dispatch({
    type: Actions.Message.GET,
    response,
  });
};
