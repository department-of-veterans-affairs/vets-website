import { Actions } from '../util/actionTypes';
import { getVaccine, getVaccineList } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails } from '../util/helpers';
import { getListWithRetry } from './common';

export const getVaccinesList = (isCurrent = false) => async dispatch => {
  dispatch({
    type: Actions.Vaccines.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const response = await getListWithRetry(dispatch, getVaccineList);

    dispatch({
      type: Actions.Vaccines.GET_LIST,
      response,
      isCurrent,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
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
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const clearVaccineDetails = () => async dispatch => {
  dispatch({ type: Actions.Vaccines.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.Vaccines.COPY_UPDATED_LIST });
};
