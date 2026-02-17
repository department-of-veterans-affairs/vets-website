import { Actions } from '../util/actionTypes';
import {
  getLabsAndTests,
  getLabOrTest,
  getMhvRadiologyTests,
  getMhvRadiologyDetails,
  getImagingStudies,
  getAcceleratedLabsAndTests,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { getListWithRetry } from './common';
import {
  dispatchDetails,
  isRadiologyId,
  sendDatadogError,
} from '../util/helpers';
import { radiologyRecordHash } from '../util/radiologyUtil';

export const getLabsAndTestsList =
  (
    isCurrent = false,
    isAccelerating = false,
    timeFrame = {},
    mergeCvixWithScdf = false,
  ) =>
  async dispatch => {
    dispatch({
      type: Actions.LabsAndTests.UPDATE_LIST_STATE,
      payload: Constants.loadStates.FETCHING,
    });
    try {
      const getList = () => {
        return getAcceleratedLabsAndTests(timeFrame);
      };
      if (isAccelerating) {
        const [labsAndTestsResponse, cvixRadiologyResponse] = await Promise.all(
          [
            getListWithRetry(dispatch, getList),
            mergeCvixWithScdf
              ? getImagingStudies()
              : Promise.resolve(undefined),
          ],
        );

        dispatch({
          type: Actions.LabsAndTests.GET_UNIFIED_LIST,
          labsAndTestsResponse,
          cvixRadiologyResponse,
          isCurrent,
        });
      } else {
        const [labsAndTestsResponse, radiologyResponse, cvixRadiologyResponse] =
          await Promise.all([
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
        const [hashedRadiologyResponse, hashedCvixRadiologyResponse] =
          await Promise.all([
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
      sendDatadogError(error, 'actions_labsAndTests_getLabsAndTestsList');
    }
  };

export const getLabsAndTestsDetails =
  (labId, labList, isAccelerating) => async dispatch => {
    try {
      /** Should be a temporary var while CVIX calls and SCDF calls coexist */
      const shouldAccelerate = isAccelerating && !isRadiologyId(labId);

      let getDetailsFunc = shouldAccelerate
        ? async () => {
            // Return a notfound response because the downstream API
            // does not support fetching a single lab or test
            return { data: { notFound: true } };
          }
        : getLabOrTest;

      if (isRadiologyId(labId)) {
        getDetailsFunc = getMhvRadiologyDetails;
      }

      await dispatchDetails(
        labId,
        labList,
        dispatch,
        getDetailsFunc,
        Actions.LabsAndTests.GET_FROM_LIST,
        shouldAccelerate
          ? Actions.LabsAndTests.GET_UNIFIED_ITEM_FROM_LIST
          : Actions.LabsAndTests.GET,
      );
    } catch (error) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
      sendDatadogError(error, 'actions_labsAndTests_getLabsAndTestsDetails');
    }
  };

export const clearLabsAndTestDetails = () => async dispatch => {
  dispatch({ type: Actions.LabsAndTests.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.LabsAndTests.COPY_UPDATED_LIST });
};

export const updateLabsAndTestDateRange =
  (option, fromDate, toDate) => async dispatch => {
    dispatch({
      type: Actions.LabsAndTests.SET_DATE_RANGE,
      payload: {
        option,
        fromDate,
        toDate,
      },
    });
  };
