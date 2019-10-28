import { getData } from '../util';

export const FETCH_RATED_DISABILITIES_SUCCESS =
  'FETCH_RATED_DISABILITIES_SUCCESS';
export const FETCH_RATED_DISABILITIES_FAILED =
  'FETCH_RATED_DISABILITIES_FAILED';

export const FETCH_TOTAL_RATING_SUCCEEDED = 'FETCH_TOTAL_RATING_SUCCEEDED';
export const FETCH_TOTAL_RATING_FAILED = 'FETCH_TOTAL_RATING_FAILED';

export function fetchRatedDisabilities() {
  return async dispatch => {
    const response = await getData(
      '/disability_compensation_form/rated_disabilities',
    );

    if (response.errors) {
      // record event here
      dispatch({
        type: FETCH_RATED_DISABILITIES_FAILED,
        response,
      });
    } else {
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
      // record event here
      dispatch({
        type: FETCH_TOTAL_RATING_SUCCEEDED,
        response,
      });
    } else {
      dispatch({
        type: FETCH_TOTAL_RATING_SUCCEEDED,
        response,
      });
    }
  };
}
