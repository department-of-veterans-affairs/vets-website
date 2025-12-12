import { Actions } from '../util/actionTypes';
import {
  getVaccine,
  getVaccineList,
  getAcceleratedImmunizations,
  getAcceleratedImmunization,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails, sendDatadogError } from '../util/helpers';
import { getListWithRetry } from './common';

export const getVaccinesList = (
  isCurrent = false,
  page,
  useBackendPagination = false,
  isAccelerating = false,
) => async dispatch => {
  dispatch({
    type: Actions.Vaccines.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const getData = isAccelerating
      ? getAcceleratedImmunizations
      : getVaccineList;

    const response = await getListWithRetry(dispatch, getData);
    dispatch({
      type: isAccelerating
        ? Actions.Vaccines.GET_UNIFIED_LIST
        : Actions.Vaccines.GET_LIST,
      response,
      isCurrent,
      useBackendPagination,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    sendDatadogError(error, 'actions_vaccines_getVaccinesList');
  }
};

export const checkForVaccineUpdates = () => async dispatch => {
  try {
    // We don't need to use getListWithRetry here. By the time we are checking for list updates,
    // the list will already be loaded, by definition.
    const response = await getVaccineList(1, false);
    dispatch({ type: Actions.Vaccines.CHECK_FOR_UPDATE, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    sendDatadogError(error, 'actions_vaccines_checkForVaccineUpdates');
  }
};

export const getVaccineDetails = (
  vaccineId,
  vaccineList,
  isAccelerating,
) => async dispatch => {
  try {
    const getData = isAccelerating ? getAcceleratedImmunization : getVaccine;
    await dispatchDetails(
      vaccineId,
      vaccineList,
      dispatch,
      getData,
      Actions.Vaccines.GET_FROM_LIST,
      isAccelerating
        ? Actions.Vaccines.GET_UNIFIED_VACCINE
        : Actions.Vaccines.GET,
    );
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    sendDatadogError(error, 'actions_vaccines_getVaccineDetails');
  }
};

export const clearVaccineDetails = () => async dispatch => {
  dispatch({ type: Actions.Vaccines.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.Vaccines.COPY_UPDATED_LIST });
};
