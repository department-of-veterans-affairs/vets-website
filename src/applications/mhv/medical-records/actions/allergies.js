import { Actions } from '../util/actionTypes';
import { getAllergies, getAllergy } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';

export const getAllergiesList = () => async dispatch => {
  try {
    const response = await getAllergies();
    dispatch({ type: Actions.Allergies.GET_LIST, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const getAllergyDetails = (id, allergyList) => async dispatch => {
  try {
    // Check if allergyList has data
    if (allergyList && allergyList.length > 0) {
      const matchingAllergy = allergyList.find(item => item.id === id);

      if (matchingAllergy) {
        // If a matching allergy is found, dispatch it
        dispatch({
          type: Actions.Allergies.GET_FROM_LIST,
          response: matchingAllergy,
        });
        return;
      }
    } else {
      // If allergyList has no data,
      // or if the allergyList item can't be found, use getAllergy(id)
      const response = await getAllergy(id);
      dispatch({ type: Actions.Allergies.GET, response });
    }
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearAllergyDetails = () => async dispatch => {
  dispatch({ type: Actions.Allergies.CLEAR_DETAIL });
};
