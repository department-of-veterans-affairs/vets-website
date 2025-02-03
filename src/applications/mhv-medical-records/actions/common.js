import { datadogRum } from '@datadog/browser-rum';
import { Actions } from '../util/actionTypes';
import { INITIAL_FHIR_LOAD_DURATION } from '../util/constants';
import * as rumActions from '../util/rumConstants';

const defaultRetryInterval = 2000;

const TIMEOUT_ERROR = 'Timed out while waiting for response';
const STATUS_SUCCESS = 'success';
const STATUS_ERROR = 'error';
const STATUS_TIMEDOUT = 'timedout';

/**
 * Helper function to create a delay
 */
const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Recursive function that will continue polling the provided API endpoint if it sends a 202 response.
 * The backend returns a 202 if the patient record has not yet been created.
 *
 * @param {Function} dispatch the dispatch function
 * @param {Function} getList the API function to poll
 * @param {number} retryInterval how often to poll, e.g. 2000 for every two seconds
 * @param {number} endTimeParam when to stop polling and return an error (milliseconds since epoch)
 * @returns the response from the API function once it returns a 200 response
 */
export const getListWithRetryRecursively = async (
  dispatch,
  getList,
  retryInterval = defaultRetryInterval,
  endTimeParam = null,
) => {
  const now = Date.now();
  const endTime =
    endTimeParam === null ? now + INITIAL_FHIR_LOAD_DURATION : endTimeParam;

  if (now >= endTime) {
    throw new Error(TIMEOUT_ERROR);
  }

  let response = await getList();
  if (response?.status === 202) {
    dispatch({
      type: Actions.Refresh.SET_INITIAL_FHIR_LOAD,
      payload: new Date(now),
    });
    await delay(retryInterval);
    response = await getListWithRetryRecursively(
      dispatch,
      getList,
      retryInterval,
      endTime,
    );
  }
  return response;
};

/**
 * Wrapper for getListWithRetryRecursively(). Its function is to make sure the
 * CLEAR_INITIAL_FHIR_LOAD action is called only once, as well as handle logging.
 */
export const getListWithRetry = async (
  dispatch,
  getList,
  retryInterval = defaultRetryInterval,
  endTimeParam = null,
) => {
  const startTime = Date.now();
  let status = null;
  try {
    const response = await getListWithRetryRecursively(
      dispatch,
      getList,
      retryInterval,
      endTimeParam,
    );
    if (response?.id) {
      // All successful FHIR calls should have an id, so this indicates a successful response, and we
      // clear the initialFhirLoad.
      dispatch({ type: Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD });
      status = STATUS_SUCCESS;
    }
    return response;
  } catch (error) {
    if (error.message === TIMEOUT_ERROR) {
      status = STATUS_TIMEDOUT;
    } else {
      status = STATUS_ERROR;
    }
    throw error;
  } finally {
    const totalDuration = Math.round((Date.now() - startTime) / 1000);
    datadogRum.addAction(rumActions.INITIAL_FHIR_LOAD_DURATION, {
      duration: totalDuration,
      status,
    });
  }
};
