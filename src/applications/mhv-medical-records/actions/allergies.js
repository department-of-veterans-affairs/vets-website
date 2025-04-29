import { Actions } from '../util/actionTypes';
import {
  getAllergies,
  getAllergy,
  getAcceleratedAllergies,
  getAcceleratedAllergy,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails } from '../util/helpers';
import { getListWithRetry } from './common';

export const getAllergiesList = (
  isCurrent = false,
  isAccelerating = false,
) => async dispatch => {
  dispatch({
    type: Actions.Allergies.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const getData = isAccelerating ? getAcceleratedAllergies : getAllergies;
    const response = await getListWithRetry(dispatch, getData);
    dispatch({
      type: Actions.Allergies.GET_LIST,
      response,
      isCurrent,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const getAllergyDetails = (
  id,
  allergyList,
  isAccelerating = false,
) => async dispatch => {
  try {
    const getData = isAccelerating ? getAcceleratedAllergy : getAllergy;
    await dispatchDetails(
      id,
      allergyList,
      dispatch,
      getData,
      Actions.Allergies.GET_FROM_LIST,
      Actions.Allergies.GET,
    );
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const clearAllergyDetails = () => async dispatch => {
  dispatch({ type: Actions.Allergies.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.Allergies.COPY_UPDATED_LIST });
};
