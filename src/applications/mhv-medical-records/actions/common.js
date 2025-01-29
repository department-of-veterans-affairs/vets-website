import { Actions } from '../util/actionTypes';
import { INITIAL_FHIR_LOAD_DURATION } from '../util/constants';

const defaultRetryInterval = 2000;

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
    throw new Error('Timed out while waiting for response');
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
 * Wrapper for getListWithRetryRecursively(). Its sole function is to make sure the
 * CLEAR_INITIAL_FHIR_LOAD action is called only once.
 */
export const getListWithRetry = async (
  dispatch,
  getList,
  retryInterval = defaultRetryInterval,
  endTimeParam = null,
) => {
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
  }
  return response;
};
