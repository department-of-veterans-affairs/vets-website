import { Actions } from '../util/actionTypes';
import { getVitalsList } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';

export const getVitals = () => async dispatch => {
  try {
    const response = await getVitalsList();
    dispatch({ type: Actions.Vitals.GET_LIST, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const getVitalDetails = (vitalType, vitalList) => async dispatch => {
  try {
    if (vitalList) {
      dispatch({ type: Actions.Vitals.GET, vitalType });
    } else {
      await dispatch(getVitals());
    }
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearVitalDetails = () => async dispatch => {
  dispatch({ type: Actions.Vitals.CLEAR_DETAIL });
};
