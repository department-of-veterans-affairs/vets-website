import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const FETCH_VERIFICATION_STATUS = 'FETCH_VERIFICATION_STATUS';
export const FETCH_VERIFICATION_STATUS_SUCCESS =
  'FETCH_VERIFICATION_STATUS_SUCCESS';
export const FETCH_VERIFICATION_STATUS_FAILURE =
  'FETCH_VERIFICATION_STATUS_FAILURE';

export function fetchVerificationStatus(userId) {
  const VERIFICATION_STATUS_ENDPOINT = `${
    environment.API_URL
  }/attendance-verification/${userId}/status`;

  return async dispatch => {
    dispatch({ type: FETCH_VERIFICATION_STATUS });

    return apiRequest(VERIFICATION_STATUS_ENDPOINT)
      .then(response =>
        dispatch({
          type: FETCH_VERIFICATION_STATUS_SUCCESS,
          response,
        }),
      )
      .catch(errors =>
        dispatch({
          type: FETCH_VERIFICATION_STATUS_FAILURE,
          errors,
        }),
      );
  };
}
