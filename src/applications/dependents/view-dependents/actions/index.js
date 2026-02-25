import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import { getData } from '../util';

export const FETCH_ALL_DEPENDENTS_STARTED = 'FETCH_ALL_DEPENDENTS_STARTED';
export const FETCH_ALL_DEPENDENTS_SUCCESS = 'FETCH_ALL_DEPENDENTS_SUCCESS';
export const FETCH_ALL_DEPENDENTS_FAILED = 'FETCH_ALL_DEPENDENTS_FAILED';

/**
 * Fetches data about dependents using the /show endpoint
 *
 * @param {boolean} dependentsModuleEnabled - Whether to use the dependents module
 * @returns {Object} response data from /show
 */
export function fetchAllDependents(dependentsModuleEnabled = false) {
  return async dispatch => {
    dispatch({ type: FETCH_ALL_DEPENDENTS_STARTED });
    const dependentsUrl = dependentsModuleEnabled
      ? `${environment.API_URL}/dependents_benefits/v0/claims/show`
      : '/dependents_applications/show';
    const response = await getData(dependentsUrl);

    if (response.errors) {
      recordEvent({
        event: `disability-view-dependents-load-failed`,
        'error-key': `${response.errors[0].status}_internal_error`,
      });
      dispatch({
        type: FETCH_ALL_DEPENDENTS_FAILED,
        response,
      });
    } else {
      recordEvent({ event: `disability-view-dependents-load-success` });
      dispatch({
        type: FETCH_ALL_DEPENDENTS_SUCCESS,
        response,
      });
    }
  };
}
