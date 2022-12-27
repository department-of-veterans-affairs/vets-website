import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

// export const MEB_CLAIM_STATUS_ENDPOINT = `${environment.API_URL}/meb_api/v0/claim_status`;
// export const TOE_CLAIM_STATUS_ENDPOINT = `${environment.API_URL}/meb_api/v0/forms_claim_status`;

const CLAIM_ENDPOINTS = {
  MEB: `${environment.API_URL}/meb_api/v0/claim_status?latest=true`,
  TOE: `${environment.API_URL}/meb_api/v0/forms_claim_status?latest=true`,
};

export const MEB_FETCH_CLAIM_STATUS = 'MEB_FETCH_CLAIM_STATUS';
export const MEB_FETCH_CLAIM_STATUS_SUCCESS = 'MEB_FETCH_CLAIM_STATUS_SUCCESS';
export const MEB_FETCH_CLAIM_STATUS_FAILED = 'MEB_FETCH_CLAIM_STATUS_FAILED';

export const TOE_FETCH_CLAIM_STATUS = 'TOE_FETCH_CLAIM_STATUS';
export const TOE_FETCH_CLAIM_STATUS_SUCCESS = 'TOE_FETCH_CLAIM_STATUS_SUCCESS';
export const TOE_FETCH_CLAIM_STATUS_FAILED = 'TOE_FETCH_CLAIM_STATUS_FAILED';

export function fetchClaimStatus(statusType) {
  return dispatch => {
    dispatch({ type: `${statusType}_FETCH_CLAIM_STATUS` });
    return apiRequest(CLAIM_ENDPOINTS[statusType])
      .then(response => {
        dispatch({
          type: `${statusType}_FETCH_CLAIM_STATUS_SUCCESS`,
          response,
        });
      })
      .catch(errors => {
        dispatch({
          type: `${statusType}_FETCH_CLAIM_STATUS_FAILED`,
          errors,
        });
      });
  };
}
