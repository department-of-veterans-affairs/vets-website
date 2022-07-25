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
export const FETCH_MILITARY_INFORMATION_SUCCESS =
  'FETCH_MILITARY_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_FAILED =
  'FETCH_MILITARY_INFORMATION_FAILED';

export const SPONSORS_ENDPOINT = `${environment.API_URL}/meb_api/v0/sponsors`;
export const FETCH_SPONSORS = 'FETCH_SPONSORS';
export const FETCH_SPONSORS_SUCCESS = 'FETCH_SPONSORS_SUCCESS';
export const FETCH_SPONSORS_FAILED = 'FETCH_SPONSORS_FAILED';
export const UPDATE_SPONSORS = 'UPDATE_SPONSORS';

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

export function fetchSponsors() {
  return async dispatch => {
    dispatch({ type: FETCH_SPONSORS });
    return apiRequest(SPONSORS_ENDPOINT)
      .then(response => {
        dispatch({
          type: FETCH_SPONSORS_SUCCESS,
          response,
        });
      })
      .catch(errors => {
        dispatch({
          type: FETCH_SPONSORS_FAILED,
          errors,
        });
      });
  };
}

export function updateSponsors(sponsors) {
  return { type: UPDATE_SPONSORS, payload: sponsors };
}
