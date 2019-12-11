import { getData } from '../util';

export const FETCH_DEPENDENTS_SUCCESS = 'FETCH_RATED_DISABILITIES_SUCCESS';
export const FETCH_DEPENDENTS_FAILED = 'FETCH_RATED_DISABILITIES_FAILED';

export function fetchDependents() {
  return async dispatch => {
    const response = await getData(
      '/disability_compensation_form/rated_disabilities',
    );

    if (response.errors) {
      dispatch({
        type: FETCH_DEPENDENTS_FAILED,
        response,
      });
    } else {
      dispatch({
        type: FETCH_DEPENDENTS_SUCCESS,
        response,
      });
    }
  };
}
