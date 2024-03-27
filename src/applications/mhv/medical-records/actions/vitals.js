import { Actions } from '../util/actionTypes';
import { getVitalsList } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { isArrayAndHasItems } from '../util/helpers';

export const getVitals = (isCurrent = false) => async dispatch => {
  dispatch({
    type: Actions.Vitals.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const response = await getVitalsList();
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
