import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import {
  FETCH_PERSONAL_INFORMATION,
  FETCH_PERSONAL_INFORMATION_FAILED,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
} from '../my-education-benefits/actions';

export const VETERANS_ENDPOINT = `${environment.API_URL}/meb_api/v0/veterans`;
export const FETCH_VETERANS_SUCCESS = 'FETCH_VETERANS_SUCCESS';
export const FETCH_VETERANS_FAILED = 'FETCH_VETERANS_FAILED';

export const CLAIMANT_INFO_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/claimant_info`;

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
