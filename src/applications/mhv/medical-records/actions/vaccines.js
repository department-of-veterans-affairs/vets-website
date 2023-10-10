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

export const getVaccineDetails = vaccineId => async dispatch => {
  try {
    const response = await getVaccine(vaccineId);
    dispatch({ type: Actions.Vaccines.GET, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearVaccineDetails = () => async dispatch => {
  dispatch({ type: Actions.Vaccines.CLEAR_DETAIL });
};
