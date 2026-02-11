import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const CLAIMANT_INFO_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/claimant_info`;

export const FETCH_PERSONAL_INFORMATION = 'FETCH_PERSONAL_INFORMATION';
export const FETCH_PERSONAL_INFORMATION_SUCCESS =
  'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_FAILED =
  'FETCH_PERSONAL_INFORMATION_FAILED';

export function fetchPersonalInformation() {
  return async dispatch => {
    dispatch({ type: FETCH_PERSONAL_INFORMATION });
    return apiRequest(CLAIMANT_INFO_ENDPOINT)
      .then(response => {
        dispatch({
          type: FETCH_PERSONAL_INFORMATION_SUCCESS,
          response,
        });
      })
      .catch(errors => {
        dispatch({
          type: FETCH_PERSONAL_INFORMATION_FAILED,
          errors,
        });
      });
  };
}

export const FETCH_DIRECT_DEPOSIT = 'FETCH_DIRECT_DEPOSIT';
export const FETCH_DIRECT_DEPOSIT_SUCCESS = 'FETCH_DIRECT_DEPOSIT_SUCCESS';
export const FETCH_DIRECT_DEPOSIT_FAILED = 'FETCH_DIRECT_DEPOSIT_FAILED';
export const FETCH_DIRECT_DEPOSIT_ENDPOINT = `${
  environment.API_URL
}/v0/profile/direct_deposits`;

export function fetchDirectDeposit() {
  return async dispatch => {
    dispatch({ type: FETCH_DIRECT_DEPOSIT });
    return apiRequest(FETCH_DIRECT_DEPOSIT_ENDPOINT)
      .then(response => {
        dispatch({
          type: FETCH_DIRECT_DEPOSIT_SUCCESS,
          response,
        });
      })
      .catch(errors => {
        dispatch({
          type: FETCH_DIRECT_DEPOSIT_FAILED,
          errors,
        });
      });
  };
}
