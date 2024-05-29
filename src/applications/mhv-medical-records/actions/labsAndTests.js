import { Actions } from '../util/actionTypes';
import { getLabsAndTests, getLabOrTest } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { getListWithRetry } from './common';

export const getLabsAndTestsList = (isCurrent = false) => async dispatch => {
  dispatch({
    type: Actions.LabsAndTests.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const response = await getListWithRetry(dispatch, getLabsAndTests);
    dispatch({
      type: Actions.LabsAndTests.GET_LIST,
      response,
      isCurrent,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const getlabsAndTestsDetails = labId => async dispatch => {
  try {
    const response = await getLabOrTest(labId);
    dispatch({ type: Actions.LabsAndTests.GET, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const clearLabsAndTestDetails = () => async dispatch => {
  dispatch({ type: Actions.LabsAndTests.CLEAR_DETAIL });
};
