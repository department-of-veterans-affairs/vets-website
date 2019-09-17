import { getData } from '../util';

export const FETCH_RATED_DISABILITIES = 'FETCH_RATED_DISABILITIES';

export function fetchRatedDisabilities() {
  return async dispatch => {
    dispatch({
      type: FETCH_RATED_DISABILITIES,
      ratedDisabilities: await getData(
        '/disability_compensation_form/rated_disabilities',
      ),
    });
  };
}
