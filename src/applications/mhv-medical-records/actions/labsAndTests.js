import { Actions } from '../util/actionTypes';
import {
  getLabsAndTests,
  getLabOrTest,
  getMhvRadiologyTests,
  getMhvRadiologyDetails,
  getImagingStudies,
  getAcceleratedLabsAndTests,
  getAcceleratedLabsAndTestsDetails,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { getListWithRetry } from './common';
import { dispatchDetails } from '../util/helpers';
import { radiologyRecordHash } from '../util/radiologyUtil';

export const getLabsAndTestsList = (
  isCurrent = false,
  isAccelerating = false,
) => async dispatch => {
  dispatch({
    type: Actions.LabsAndTests.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    if (isAccelerating) {
      const labsAndTestsResponse = await getListWithRetry(
        dispatch,
        getAcceleratedLabsAndTests,
      );
      dispatch({
        type: Actions.LabsAndTests.GET_UNIFIED_LIST,
        labsAndTestsResponse,
        isCurrent,
      });
    } else {
      const [
        labsAndTestsResponse,
        radiologyResponse,
        cvixRadiologyResponse,
      ] = await Promise.all([
        getListWithRetry(dispatch, getLabsAndTests),
        getMhvRadiologyTests(),
        getImagingStudies(),
      ]);

      /** Helper function to hash radiology responses */
      const hashRadiologyResponses = async responses => {
        if (!Array.isArray(responses)) return [];

        return Promise.all(
          responses.map(async record => ({
            ...record,
            hash: await radiologyRecordHash(record),
          })),
        );
      };

      // Use the helper function for both responses
      const [
        hashedRadiologyResponse,
        hashedCvixRadiologyResponse,
      ] = await Promise.all([
        hashRadiologyResponses(radiologyResponse),
        hashRadiologyResponses(cvixRadiologyResponse),
      ]);

      dispatch({
        type: Actions.LabsAndTests.GET_LIST,
        labsAndTestsResponse,
        radiologyResponse: hashedRadiologyResponse,
        cvixRadiologyResponse: hashedCvixRadiologyResponse,
        isCurrent,
      });
    }
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const getlabsAndTestsDetails = (
  labId,
  labList,
  isAccelerating,
) => async dispatch => {
  try {
    if (isAccelerating) {
      await dispatchDetails(
        labId,
        labList,
        dispatch,
        getAcceleratedLabsAndTestsDetails,
        Actions.LabsAndTests.GET_FROM_LIST,
        Actions.LabsAndTests.GET_UNIFIED_ITEM_FROM_LIST,
      );
    } else {
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
    }
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
