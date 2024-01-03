import { Actions } from '../util/actionTypes';
import { getAllergies, getAllergy } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails } from '../util/helpers';

export const getAllergiesList = (isCurrent = false) => async dispatch => {
  dispatch({
    type: Actions.Allergies.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const response = await getAllergies();
    dispatch({
      type: Actions.Allergies.GET_LIST,
      response,
      isCurrent,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const getAllergyDetails = (id, allergyList) => async dispatch => {
  try {
    await dispatchDetails(
      id,
      allergyList,
      dispatch,
      getAllergy,
      Actions.Allergies.GET_FROM_LIST,
      Actions.Allergies.GET,
    );
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearAllergyDetails = () => async dispatch => {
  dispatch({ type: Actions.Allergies.CLEAR_DETAIL });
};
