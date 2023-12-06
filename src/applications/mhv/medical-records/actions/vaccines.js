import { Actions } from '../util/actionTypes';
import { getVaccine, getVaccineList } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';

export const getVaccinesList = () => async dispatch => {
  try {
    const response = await getVaccineList();

    dispatch({ type: Actions.Vaccines.GET_LIST, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const getVaccineDetails = (vaccineId, vaccineList) => async dispatch => {
  try {
    // Check if vaccineList has data
    if (vaccineList && vaccineList.length > 0) {
      const matchingVaccine = vaccineList.find(item => item.id === vaccineId);

      if (matchingVaccine) {
        // If a matching vaccine is found, dispatch it
        dispatch({
          type: Actions.Vaccines.GET_FROM_LIST,
          response: matchingVaccine,
        });
        return;
      }
    } else {
      // If vaccineList has no data,
      // or if the vaccineList item can't be found, use getVaccine(vaccineId)
      const response = await getVaccine(vaccineId);
      dispatch({ type: Actions.Vaccines.GET, response });
    }
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearVaccineDetails = () => async dispatch => {
  dispatch({ type: Actions.Vaccines.CLEAR_DETAIL });
};
