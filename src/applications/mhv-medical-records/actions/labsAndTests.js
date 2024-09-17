import { Actions } from '../util/actionTypes';
import {
  getLabsAndTests,
  getLabOrTest,
  getMhvRadiologyTests,
  getMhvRadiologyDetails,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { getListWithRetry } from './common';
import { dispatchDetails, radiologyRecordHash } from '../util/helpers';

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
    const hashedRadiologyResponse = Array.isArray(radiologyResponse)
      ? await Promise.all(
          radiologyResponse.map(async record => ({
            ...record,
            hash: await radiologyRecordHash(record),
          })),
        )
      : [];
    dispatch({
      type: Actions.LabsAndTests.GET_LIST,
      labsAndTestsResponse,
      radiologyResponse: hashedRadiologyResponse,
      isCurrent,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const getlabsAndTestsDetails = (labId, labList) => async dispatch => {
  try {
    let getDetailsFunc = getLabOrTest;

    if (labId && labId.charAt(0).toLowerCase() === 'r') {
      getDetailsFunc = getMhvRadiologyDetails;
    }

    await dispatchDetails(
      labId,
      labList,
      dispatch,
      getDetailsFunc,
      Actions.LabsAndTests.GET_FROM_LIST,
      Actions.LabsAndTests.GET,
    );
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
