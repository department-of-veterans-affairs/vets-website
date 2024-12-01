import { Actions } from '../util/actionTypes';
import { getVitalsList, getAcceleratedVitals } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { isArrayAndHasItems } from '../util/helpers';
import { getListWithRetry } from './common';

export const getVitals = (
  isCurrent = false,
  isAccelerating = false,
  vitalsDate = '',
) => async dispatch => {
  dispatch({
    type: Actions.Vitals.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    let response;
    if (isAccelerating) {
      response = await getAcceleratedVitals(vitalsDate);
    } else {
      response = await getListWithRetry(dispatch, getVitalsList);
    }
    dispatch({
      type: Actions.Vitals.GET_LIST,
      response,
      isCurrent,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const getVitalDetails = (vitalType, vitalList) => async dispatch => {
  try {
    if (!isArrayAndHasItems(vitalList)) {
      await dispatch(getVitals());
    }
    dispatch({ type: Actions.Vitals.GET, vitalType });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const clearVitalDetails = () => async dispatch => {
  dispatch({ type: Actions.Vitals.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.Vitals.COPY_UPDATED_LIST });
};
