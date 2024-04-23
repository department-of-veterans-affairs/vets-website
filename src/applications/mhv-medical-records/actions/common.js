import { Actions } from '../util/actionTypes';

const defaultRetryInterval = 2000;
const defaultEndTimeOffset = 120000;

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
export const getListWithRetry = async (
  dispatch,
  getList,
  retryInterval = defaultRetryInterval,
  endTimeParam = null,
) => {
  const endTime =
    endTimeParam === null ? Date.now() + defaultEndTimeOffset : endTimeParam;

  if (Date.now() >= endTime) {
    throw new Error('Timed out while waiting for response');
  }

  const response = await getList();
  if (response?.status === 202) {
    dispatch({ type: Actions.Refresh.SET_INITIAL_FHIR_LOAD });
    if (Date.now() < endTime) {
      await delay(retryInterval);
      return getListWithRetry(dispatch, getList, retryInterval, endTime);
    }
  }
  return response;
};
