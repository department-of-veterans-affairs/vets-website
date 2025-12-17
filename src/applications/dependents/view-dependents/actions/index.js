import recordEvent from 'platform/monitoring/record-event';
import { getData } from '../util';

export const FETCH_ALL_DEPENDENTS_STARTED = 'FETCH_ALL_DEPENDENTS_STARTED';
export const FETCH_ALL_DEPENDENTS_SUCCESS = 'FETCH_ALL_DEPENDENTS_SUCCESS';
export const FETCH_ALL_DEPENDENTS_FAILED = 'FETCH_ALL_DEPENDENTS_FAILED';

/**
 * Fetches data about dependents using the /show endpoint
 * @returns {Object} response data from /show
 */
export function fetchAllDependents() {
  return async dispatch => {
    dispatch({ type: FETCH_ALL_DEPENDENTS_STARTED });
    const response = await getData('/dependents_applications/show');

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
