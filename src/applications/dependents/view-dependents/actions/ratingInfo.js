import recordEvent from 'platform/monitoring/record-event';
import { getData } from '../util';

export const FETCH_RATING_INFO_STARTED = 'FETCH_RATING_INFO_STARTED';
export const FETCH_RATING_INFO_SUCCESS = 'FETCH_RATING_INFO_SUCCESS';
export const FETCH_RATING_INFO_FAILED = 'FETCH_RATING_INFO_FAILED';

/**
 * Fetches data about a veteran's disability rating from /rating_info
 * @returns {Object} response data from /rating_info
 */
export function fetchRatingInfo() {
  return async dispatch => {
    dispatch({ type: FETCH_RATING_INFO_STARTED });
    const response = await getData('/disability_compensation_form/rating_info');

    if (response?.errors) {
      recordEvent({
        event: `disability-rating-info-load-failed`,
        'error-key': `${response.errors[0].status}_internal_error`,
      });
      dispatch({
        type: FETCH_RATING_INFO_FAILED,
        response,
      });
    } else {
      recordEvent({ event: `disability-rating-info-load-success` });
      dispatch({
        type: FETCH_RATING_INFO_SUCCESS,
        response,
      });
    }
  };
}
