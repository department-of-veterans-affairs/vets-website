import { Actions } from '../util/actionTypes';
import {
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
) => async dispatch => {
  dispatch({
    type: Actions.Vaccines.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const response = await getListWithRetry(
      dispatch,
      getAcceleratedImmunizations,
    );
    dispatch({
      type: Actions.Vaccines.GET_UNIFIED_LIST,
      response,
      isCurrent,
      useBackendPagination,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    sendDatadogError(error, 'actions_vaccines_getVaccinesList');
  }
};

// Called by useListRefresh hook to check for updates
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

export const getVaccineDetails = (vaccineId, vaccineList) => async dispatch => {
  try {
    await dispatchDetails(
      vaccineId,
      vaccineList,
      dispatch,
      getAcceleratedImmunization,
      Actions.Vaccines.GET_FROM_LIST,
      Actions.Vaccines.GET_UNIFIED_VACCINE,
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
