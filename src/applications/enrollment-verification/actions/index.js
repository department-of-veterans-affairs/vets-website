import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const FETCH_VERIFICATION_STATUS = 'FETCH_VERIFICATION_STATUS';
export const FETCH_VERIFICATION_STATUS_SUCCESS =
  'FETCH_VERIFICATION_STATUS_SUCCESS';
export const FETCH_VERIFICATION_STATUS_FAILURE =
  'FETCH_VERIFICATION_STATUS_FAILURE';

export const VERIFICATION_STATUS_CORRECT = 'VERIFICATION_STATUS_CORRECT';
export const VERIFICATION_STATUS_INCORRECT = 'INVERIFICATION_STATUS_CORRECT';

export const PAYMENT_STATUS = {
  ONGOING: 'PAYMENT_STATUS_ONGOING',
  PAUSED: 'PAYMENT_STATUS_PAUSED',
  SCO_PAUSED: 'PAYMENT_STATUS_SCO_PAUSED',
};

export function fetchVerificationStatus() {
  const VERIFICATION_STATUS_ENDPOINT = `${
    environment.API_URL
  }/attendance-verification/1/status`;
  // }/attendance-verification/${userId}/status`;

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
