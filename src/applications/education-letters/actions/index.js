import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const CLAIM_STATUS_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/claim_status`;

export const FETCH_CLAIM_STATUS = 'FETCH_CLAIM_STATUS';
export const FETCH_CLAIM_STATUS_SUCCESS = 'FETCH_CLAIM_STATUS_SUCCESS';
export const FETCH_CLAIM_STATUS_FAILED = 'FETCH_CLAIM_STATUS_FAILED';

export function fetchClaimStatus() {
  return async dispatch => {
    dispatch({ type: FETCH_CLAIM_STATUS });
    return apiRequest(CLAIM_STATUS_ENDPOINT)
      .then(response => {
        dispatch({
          type: FETCH_CLAIM_STATUS_SUCCESS,
          response,
        });
      })
      .catch(errors => {
        dispatch({
          type: FETCH_CLAIM_STATUS_FAILED,
          errors,
        });
      });
  };
}
