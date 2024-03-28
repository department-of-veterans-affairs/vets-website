import { Actions } from '../util/actionTypes';
import { getAllRecipients } from '../api/SmApi';

export const getAllTriageTeamRecipients = () => async dispatch => {
  try {
    const response = await getAllRecipients();
    dispatch({
      type: Actions.AllRecipients.GET_LIST,
      response,
    });
  } catch (error) {
    dispatch({
      type: Actions.AllRecipients.GET_LIST_ERROR,
    });
  }
};
