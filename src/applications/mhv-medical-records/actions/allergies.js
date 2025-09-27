import { Actions } from '../util/actionTypes';
import {
  getAllergies,
  getAllergy,
  getAllergiesWithOHData,
  getAllergyWithOHData,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails } from '../util/helpers';
import { getListWithRetry } from './common';

export const getAllergiesList = (
  isCurrent = false,
  isCerner,
) => async dispatch => {
  dispatch({
    type: Actions.Allergies.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    let getData;
    let actionType;

    if (isCerner) {
      // Path 1: v1 OH endpoint (Cerner patients)
      getData = getAllergiesWithOHData;
      actionType = Actions.Allergies.GET_LIST;
    } else {
      // Path 2: v1 regular endpoint (VistA patients)
      getData = getAllergies;
      actionType = Actions.Allergies.GET_LIST;
    }

    const response = await getListWithRetry(dispatch, getData);
    dispatch({
      type: actionType,
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
  isCerner,
) => async dispatch => {
  try {
    let getDetailsFunc;
    let actionType;

    if (isCerner) {
      // Path 1: v1 OH endpoint (Cerner patients)
      getDetailsFunc = getAllergyWithOHData;
      actionType = Actions.Allergies.GET;
    } else {
      // Path 2: v1 regular endpoint (VistA patients)
      getDetailsFunc = getAllergy;
      actionType = Actions.Allergies.GET;
    }

    await dispatchDetails(
      id,
      allergyList,
      dispatch,
      getDetailsFunc,
      Actions.Allergies.GET_FROM_LIST,
      actionType,
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
