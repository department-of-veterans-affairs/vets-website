import { Actions } from '../util/actionTypes';
import { getVaccine, getVaccineList } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails } from '../util/helpers';

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
    await dispatchDetails(
      vaccineId,
      vaccineList,
      dispatch,
      getVaccine,
      Actions.Vaccines.GET_FROM_LIST,
      Actions.Vaccines.GET,
    );
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearVaccineDetails = () => async dispatch => {
  dispatch({ type: Actions.Vaccines.CLEAR_DETAIL });
};
