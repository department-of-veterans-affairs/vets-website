import { getData } from '../../profile360/util';

export const FETCH_RATED_DISABILITIES = 'FETCH_RATED_DISABILITIES';

export function fetchRatedDisabilities() {
  console.log('fetching disabilities in action');
  return async dispatch => {
    dispatch({
      type: FETCH_RATED_DISABILITIES,
      ratedDisabilities: await getData(
        '/disability_compensation_form/rated_disabilities',
      ),
    });
  };
}
