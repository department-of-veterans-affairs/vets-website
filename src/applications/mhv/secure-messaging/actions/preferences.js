import { getSignature } from '../api/SmApi';
import { Actions } from '../util/actionTypes';

export const getPatientSignature = () => async dispatch => {
  const response = await getSignature();
  if (response.data) {
    dispatch({
      type: Actions.Preferences.GET_USER_SIGNATURE,
      payload: response.data,
    });
  }
};
