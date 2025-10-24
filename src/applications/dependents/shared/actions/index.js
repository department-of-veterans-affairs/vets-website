import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';

export const DEPENDENTS_FETCH_STARTED = 'DEPENDENTS_FETCH_STARTED';
export const DEPENDENTS_FETCH_SUCCESS = 'DEPENDENTS_FETCH_SUCCESS';
export const DEPENDENTS_FETCH_FAILED = 'DEPENDENTS_FETCH_FAILED';
export const DEPENDENTS_URL = `${
  environment.API_URL
}/v0/dependents_applications/show`;

/**
 * @typedef FetchDependentsReturn
 * @type {Object}
 * @property {String} type - Fetch status
 * @property {Array} data - Array of typed dependents
 * @property {String|null} error - Error message if any
 */
/**
 * Fetch Intent to File from given API
 * @param {String} apiUrl - API endpoint
 * @returns {FetchDependentsReturn}
 */
export const fetchDependents = () => async dispatch => {
  try {
    dispatch({ type: DEPENDENTS_FETCH_STARTED });
    const response = await apiRequest(DEPENDENTS_URL);
    dispatch({
      type: DEPENDENTS_FETCH_SUCCESS,
      data: response?.data.attributes?.persons || [],
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    dispatch({
      type: DEPENDENTS_FETCH_FAILED,
      data: {
        error: error?.response?.data?.errors?.[0]?.detail || 'Unknown error',
      },
    });
  }
};
