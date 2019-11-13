import recordEvent from 'platform/monitoring/record-event';
import { getData } from '../util';

export const FETCH_RATED_DISABILITIES_SUCCESS =
  'FETCH_RATED_DISABILITIES_SUCCESS';
export const FETCH_RATED_DISABILITIES_FAILED =
  'FETCH_RATED_DISABILITIES_FAILED';

export const FETCH_TOTAL_RATING_SUCCEEDED = 'FETCH_TOTAL_RATING_SUCCEEDED';
export const FETCH_TOTAL_RATING_FAILED = 'FETCH_TOTAL_RATING_FAILED';

const serverErrorRegex = /^5\d{2}$/;
const serviceErrorRegex = /^4\d{2}$/;
const DISABILITY_PREFIX = 'disability-ratings';

export function fetchRatedDisabilities() {
  return async dispatch => {
    const response = await getData(
      '/disability_compensation_form/rated_disabilities',
    );

    if (response.errors) {
      const errorCode = response.errors[0].code;
      if (serverErrorRegex.test(errorCode)) {
        recordEvent({
          event: `${DISABILITY_PREFIX}-list-load-failed`,
          'error-key': '500 internal error',
        });
      } else if (serviceErrorRegex.test(errorCode)) {
        recordEvent({
          event: `${DISABILITY_PREFIX}-list-load-failed`,
          'error-key': '401 no disabilities found',
        });
      }
      dispatch({
        type: FETCH_RATED_DISABILITIES_FAILED,
        response,
      });
    } else {
      recordEvent({ event: `${DISABILITY_PREFIX}-list-load-success` });
      dispatch({
        type: FETCH_RATED_DISABILITIES_SUCCESS,
        response,
      });
    }
  };
}

export function fetchTotalDisabilityRating() {
  return async dispatch => {
    const response = await getData(
      '/disability_compensation_form/rated_disabilities',
    );

    if (response.errors) {
      const errorCode = response.errors[0].code;
      if (serverErrorRegex.test(errorCode)) {
        recordEvent({
          event: `${DISABILITY_PREFIX}-combined-load-failed`,
          'error-key': '500 internal error',
        });
      } else if (serviceErrorRegex.test(errorCode)) {
        recordEvent({
          event: `${DISABILITY_PREFIX}-combined-load-failed`,
          'error-key': '401 no combined rating found',
        });
      }
      dispatch({
        type: FETCH_TOTAL_RATING_SUCCEEDED,
        response,
      });
    } else {
      recordEvent({ event: `${DISABILITY_PREFIX}-combined-load-success` });
      dispatch({
        type: FETCH_TOTAL_RATING_SUCCEEDED,
        response,
      });
    }
  };
}
