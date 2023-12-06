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
    // Check if vitalList has data
    if (vitalList && vitalList.length > 0) {
      const matchingVital = vitalList.find(item => item.id === vitalType);

      if (matchingVital) {
        // If a matching vital is found, dispatch it
        dispatch({
          type: Actions.Vitals.GET_FROM_LIST,
          response: matchingVital,
        });
        return;
      }
    } else {
      // If vitalList has no data,
      // or if the vitalList item can't be found, use getVitals()
      await dispatch(getVitals());
      dispatch({ type: Actions.Vitals.GET, vitalType });
    }
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearVitalDetails = () => async dispatch => {
  dispatch({ type: Actions.Vitals.CLEAR_DETAIL });
};
