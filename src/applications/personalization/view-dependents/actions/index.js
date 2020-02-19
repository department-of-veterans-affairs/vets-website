import { getData } from '../util';

export const FETCH_ALL_DEPENDENTS_SUCCESS = 'FETCH_ALL_DEPENDENTS_SUCCESS';
export const FETCH_ALL_DEPENDENTS_FAILED = 'FETCH_ALL_DEPENDENTS_FAILED';

export function fetchAllDependents() {
  return async dispatch => {
    const response = await getData('/dependents_applications/show');

    if (response.errors) {
      dispatch({
        type: FETCH_ALL_DEPENDENTS_FAILED,
        response,
      });
    } else {
      dispatch({
        type: FETCH_ALL_DEPENDENTS_SUCCESS,
        response,
      });
    }
  };
}
