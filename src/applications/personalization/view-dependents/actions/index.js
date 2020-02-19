import { apiRequest } from 'platform/utilities/api';

export const FETCH_ALL_DEPENDENTS_SUCCESS = 'FETCH_ALL_DEPENDENTS_SUCCESS';
export const FETCH_ALL_DEPENDENTS_FAILED = 'FETCH_ALL_DEPENDENTS_FAILED';

export function fetchAllDependents() {
  return async dispatch => {
    const response = await apiRequest('/dependents_applications/show');

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
