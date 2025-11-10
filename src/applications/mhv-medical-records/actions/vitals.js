import { Actions } from '../util/actionTypes';
import { getVitalsList, getVitalsWithOHData } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { isArrayAndHasItems, sendDatadogError } from '../util/helpers';
import { getListWithRetry } from './common';

export const getVitals = (
  isCurrent = false,
  isCerner = false,
  vitalsDate = '',
) => async dispatch => {
  dispatch({
    type: Actions.Vitals.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    let response;
    if (isCerner) {
      response = await getVitalsWithOHData(vitalsDate);
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
    sendDatadogError(error, 'actions_vitals_getVitals');
  }
};

/**
 * Updates the list of vitals with the selected vital type, **will** make an API call to populate the data
 *
 * @param {string} vitalType a valid vital type
 * @param {array} vitalList the list of vitals to check if it's empty
 */
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

/**
 * Updates the list of vitals with the selected vital type, **will not** make an API call to populate the data
 *
 * @param {string} vitalType a valid vital type
 */
export const setVitalsList = vitalType => async dispatch => {
  dispatch({ type: Actions.Vitals.GET, vitalType });
};

export const clearVitalDetails = () => async dispatch => {
  dispatch({ type: Actions.Vitals.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.Vitals.COPY_UPDATED_LIST });
};
