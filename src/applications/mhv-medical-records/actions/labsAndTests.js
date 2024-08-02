import { Actions } from '../util/actionTypes';
import {
  getLabsAndTests,
  getLabOrTest,
  getMhvRadiologyTests,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { getListWithRetry } from './common';

export const getLabsAndTestsList = (isCurrent = false) => async dispatch => {
  dispatch({
    type: Actions.LabsAndTests.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const labsAndTestsResponse = await getListWithRetry(
      dispatch,
      getLabsAndTests,
    );
    const radiologyResponse = await getMhvRadiologyTests();
    dispatch({
      type: Actions.LabsAndTests.GET_LIST,
      labsAndTestsResponse,
      radiologyResponse,
      isCurrent,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const getlabsAndTestsDetails = labId => async dispatch => {
  try {
    let response;
    if (labId && labId.charAt(0).toLowerCase() === 'r') {
      const records = await getMhvRadiologyTests();
      response = records.find(record => +record.id === +labId.substring(1));
    } else {
      response = await getLabOrTest(labId);
    }
    dispatch({ type: Actions.LabsAndTests.GET, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const clearLabsAndTestDetails = () => async dispatch => {
  dispatch({ type: Actions.LabsAndTests.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.LabsAndTests.COPY_UPDATED_LIST });
};
