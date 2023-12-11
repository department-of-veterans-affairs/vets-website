import { Actions } from '../util/actionTypes';
import { getVitalsList } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
// import { dispatchDetails } from '../util/helpers';

export const getVitals = () => async dispatch => {
  try {
    const response = await getVitalsList();
    dispatch({ type: Actions.Vitals.GET_LIST, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const getVitalDetails = vitalType => async dispatch => {
  try {
    await dispatch(getVitals());
    dispatch({ type: Actions.Vitals.GET, vitalType });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearVitalDetails = () => async dispatch => {
  dispatch({ type: Actions.Vitals.CLEAR_DETAIL });
};
