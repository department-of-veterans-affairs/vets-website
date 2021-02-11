import recordEvent from 'platform/monitoring/record-event';
import { getData, isServerError, isClientError } from '../util';

export const FETCH_RATED_DISABILITIES_SUCCESS =
  'FETCH_RATED_DISABILITIES_SUCCESS';
export const FETCH_RATED_DISABILITIES_FAILED =
  'FETCH_RATED_DISABILITIES_FAILED';

export const FETCH_TOTAL_RATING_STARTED = 'FETCH_TOTAL_RATING_STARTED';
export const FETCH_TOTAL_RATING_SUCCEEDED = 'FETCH_TOTAL_RATING_SUCCEEDED';
export const FETCH_TOTAL_RATING_FAILED = 'FETCH_TOTAL_RATING_FAILED';

const DISABILITY_PREFIX = 'disability-ratings';

export function fetchRatedDisabilities() {
  return async dispatch => {
    const response = await getData(
      '/disability_compensation_form/rated_disabilities',
    );

    if (response.errors) {
      const errorCode = response.errors[0].code;
      if (isServerError(errorCode)) {
        recordEvent({
          event: `${DISABILITY_PREFIX}-list-load-failed`,
          'error-key': `${errorCode} internal error`,
        });
      } else if (isClientError(errorCode)) {
        recordEvent({
          event: `${DISABILITY_PREFIX}-list-load-failed`,
          'error-key': `${errorCode} no disabilities found`,
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
    dispatch({
      type: FETCH_TOTAL_RATING_STARTED,
    });
    const response = await getData('/disability_compensation_form/rating_info');

    if (response.errors) {
      const errorCode = response.errors[0].code;
      if (isServerError(errorCode)) {
        recordEvent({
          event: `${DISABILITY_PREFIX}-combined-load-failed`,
          'error-key': `${errorCode} internal error`,
        });
      } else if (isClientError(errorCode)) {
        recordEvent({
          event: `${DISABILITY_PREFIX}-combined-load-failed`,
          'error-key': `${errorCode} no combined rating found`,
        });
      }
      dispatch({
        type: FETCH_TOTAL_RATING_FAILED,
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
