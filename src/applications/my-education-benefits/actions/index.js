import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const FETCH_PERSONAL_INFORMATION = 'FETCH_PERSONAL_INFORMATION';
export const FETCH_PERSONAL_INFORMATION_SUCCESS =
  'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_FAILED =
  'FETCH_PERSONAL_INFORMATION_FAILED';
export const FETCH_MILITARY_INFORMATION_SUCCESS =
  'FETCH_MILITARY_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_FAILED =
  'FETCH_MILITARY_INFORMATION_FAILED';

export function fetchPersonalInformation() {
  return async dispatch => {
    dispatch({ type: FETCH_PERSONAL_INFORMATION });
    const claimantIntoEndpoint = `${
      environment.API_URL
    }/meb_api/v0/claimant_info`;

    return apiRequest(claimantIntoEndpoint)
      .then(response =>
        dispatch({
          type: FETCH_PERSONAL_INFORMATION_SUCCESS,
          response,
        }),
      )
      .catch(errors =>
        dispatch({
          type: FETCH_PERSONAL_INFORMATION_FAILED,
          errors,
        }),
      );
  };
}
