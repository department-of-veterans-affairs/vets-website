import {
  getAllergies,
  getAllergy,
  getAcceleratedAllergies,
  getAcceleratedAllergy,
  getAllergiesWithOHData,
  getAllergyWithOHData,
} from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';
import { dispatchDetails, sendDatadogError } from '../util/helpers';
import { getListWithRetry } from './common';

export const getAllergiesList =
  (isCurrent = false, isAccelerating = false, isCerner = false) =>
  async dispatch => {
    dispatch({
      type: Actions.Allergies.UPDATE_LIST_STATE,
      payload: Constants.loadStates.FETCHING,
    });
    try {
      let getData;
      let actionType;

      if (isAccelerating) {
        // Path 1: v2 SCDF endpoint (flag-enabled users)
        getData = getAcceleratedAllergies;
        actionType = Actions.Allergies.GET_UNIFIED_LIST;
      } else if (isCerner) {
        // Path 2: v1 OH endpoint (Cerner patients)
        getData = getAllergiesWithOHData;
        actionType = Actions.Allergies.GET_LIST;
      } else {
        // Path 3: v1 regular endpoint (VistA patients)
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
      sendDatadogError(error, 'actions_allergies_getAllergiesList');
    }
  };

export const getAllergyDetails =
  (id, allergyList, isAccelerating = false, isCerner = false) =>
  async dispatch => {
    try {
      let getDetailsFunc;
      let actionType;

      if (isAccelerating) {
        // Path 1: v2 SCDF endpoint (flag-enabled users)
        getDetailsFunc = getAcceleratedAllergy;
        actionType = Actions.Allergies.GET_UNIFIED_ITEM;
      } else if (isCerner) {
        // Path 2: v1 OH endpoint (Cerner patients)
        getDetailsFunc = getAllergyWithOHData;
        actionType = Actions.Allergies.GET;
      } else {
        // Path 3: v1 regular endpoint (VistA patients)
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
      sendDatadogError(error, 'actions_allergies_getAllergyDetails');
    }
  };

export const clearAllergyDetails = () => async dispatch => {
  dispatch({ type: Actions.Allergies.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.Allergies.COPY_UPDATED_LIST });
};
