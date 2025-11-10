import { Actions } from '../util/actionTypes';
import {
  getAllergies,
  getAllergy,
  getAllergiesWithOHData,
  getAllergyWithOHData,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails, sendDatadogError } from '../util/helpers';
import { getListWithRetry } from './common';

export const getAllergiesList = (
  isCurrent = false,
  isCerner = false,
) => async dispatch => {
  dispatch({
    type: Actions.Allergies.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const getData = isCerner ? getAllergiesWithOHData : getAllergies;
    const actionType = Actions.Allergies.GET_LIST;

    const response = await getListWithRetry(dispatch, getData);
    dispatch({
      type: actionType,
      response,
      isCurrent,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    sendDatadogError(error, 'actions_allergies_getAllergiesList');
  }
};

export const getAllergyDetails = (
  id,
  allergyList,
  isCerner = false,
) => async dispatch => {
  try {
    const getDetailsFunc = isCerner ? getAllergyWithOHData : getAllergy;
    const actionType = Actions.Allergies.GET;

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
