import { Actions } from '../util/actionTypes';
import {
  getMhvRadiologyTests,
  getMhvRadiologyDetails,
  getImagingStudies,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails, sendDatadogError } from '../util/helpers';
import { radiologyRecordHash } from '../util/radiologyUtil';

/**
 * Fetches the list of radiology records from both PHR (MHV) and CVIX sources,
 * hashes them for deduplication, and dispatches them to the store.
 *
 * @param {boolean} isCurrent - Whether this fetch represents "current" data for refresh tracking.
 * @returns {Function} Async thunk action.
 */
export const getRadiologyList =
  (isCurrent = false) =>
  async dispatch => {
    dispatch({
      type: Actions.Radiology.UPDATE_LIST_STATE,
      payload: Constants.loadStates.FETCHING,
    });
    try {
      const [radiologyResponse, cvixRadiologyResponse] = await Promise.all([
        getMhvRadiologyTests(),
        getImagingStudies(),
      ]);

      /** Helper function to hash radiology responses for ID generation */
      const hashRadiologyResponses = async responses => {
        if (!Array.isArray(responses)) return [];
        return Promise.all(
          responses.map(async record => ({
            ...record,
            hash: await radiologyRecordHash(record),
          })),
        );
      };

      const [hashedRadiologyResponse, hashedCvixRadiologyResponse] =
        await Promise.all([
          hashRadiologyResponses(radiologyResponse),
          hashRadiologyResponses(cvixRadiologyResponse),
        ]);

      dispatch({
        type: Actions.Radiology.GET_LIST,
        radiologyResponse: hashedRadiologyResponse,
        cvixRadiologyResponse: hashedCvixRadiologyResponse,
        isCurrent,
      });
    } catch (error) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
      sendDatadogError(error, 'actions_radiology_getRadiologyList');
    }
  };

/**
 * Fetches the details of a single radiology record. If the record is already in the list,
 * it will be returned from the list. Otherwise, a detail API call is made.
 *
 * @param {string} radiologyId - The ID of the radiology record to fetch.
 * @param {Array} radiologyList - The current list of radiology records in state.
 * @returns {Function} Async thunk action.
 */
export const getRadiologyDetails =
  (radiologyId, radiologyList) => async dispatch => {
    try {
      await dispatchDetails(
        radiologyId,
        radiologyList,
        dispatch,
        getMhvRadiologyDetails,
        Actions.Radiology.GET_FROM_LIST,
        Actions.Radiology.GET,
      );
    } catch (error) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
      sendDatadogError(error, 'actions_radiology_getRadiologyDetails');
    }
  };

/**
 * Clears the currently displayed radiology detail from the store.
 *
 * @returns {Function} Async thunk action.
 */
export const clearRadiologyDetails = () => async dispatch => {
  dispatch({ type: Actions.Radiology.CLEAR_DETAIL });
};

/**
 * Copies the updated radiology list into the display list.
 * This is typically called after a refresh detects new records.
 *
 * @returns {Function} Async thunk action.
 */
export const reloadRadiologyRecords = () => async dispatch => {
  dispatch({ type: Actions.Radiology.COPY_UPDATED_LIST });
};

/**
 * Updates the date range filter for radiology records.
 *
 * @param {string} option - The selected date range option (e.g., '3', '6', '1y').
 * @param {string} fromDate - The start date of the range.
 * @param {string} toDate - The end date of the range.
 * @returns {Function} Async thunk action.
 */
export const updateRadiologyDateRange =
  (option, fromDate, toDate) => async dispatch => {
    dispatch({
      type: Actions.Radiology.SET_DATE_RANGE,
      payload: {
        option,
        fromDate,
        toDate,
      },
    });
  };
