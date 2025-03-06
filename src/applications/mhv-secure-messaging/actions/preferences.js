import { getSignature } from '../api/SmApi';
import { Actions } from '../util/actionTypes';

export const getPatientSignature = () => async dispatch => {
  try {
    const response = await getSignature();
    dispatch({
      type: Actions.Preferences.GET_USER_SIGNATURE,
      payload: response.data?.attributes,
    });
  } catch (error) {
    dispatch({
      type: Actions.Preferences.GET_USER_SIGNATURE_ERROR,
    });
  }
};
