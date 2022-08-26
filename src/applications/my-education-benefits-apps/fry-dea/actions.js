import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const VETERANS_ENDPOINT = `${environment.API_URL}/meb_api/v0/veterans`;
export const FETCH_VETERANS_SUCCESS = 'FETCH_VETERANS_SUCCESS';
export const FETCH_VETERANS_FAILED = 'FETCH_VETERANS_FAILED';

export function fetchVeterans() {
  return async dispatch => {
    return apiRequest(VETERANS_ENDPOINT)
      .then(response => {
        dispatch({
          type: FETCH_VETERANS_SUCCESS,
          response,
        });
      })
      .catch(errors => {
        dispatch({
          type: FETCH_VETERANS_FAILED,
          errors,
        });
      });
  };
}
