import { Actions } from '../util/actionTypes';

export const showContactListSuccessMessage = message => async dispatch => {
  dispatch({
    type: Actions.ContactList.SHOW_SUCCESS_MESSAGE,
    payload: { message, timestamp: new Date().getTime() },
  });
};

export const clearContactListSuccessMessage = () => async dispatch => {
  dispatch({ type: Actions.ContactList.CLEAR_SUCCESS_MESSAGE });
};
