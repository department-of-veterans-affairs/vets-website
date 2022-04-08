import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const FETCH_POST_911_GI_BILL_ELIGIBILITY =
  'FETCH_POST_911_GI_BILL_ELIGIBILITY';
export const FETCH_POST_911_GI_BILL_ELIGIBILITY_SUCCESS =
  'FETCH_POST_911_GI_BILL_ELIGIBILITY_SUCCESS';
export const FETCH_POST_911_GI_BILL_ELIGIBILITY_FAILURE =
  'FETCH_POST_911_GI_BILL_ELIGIBILITY_FAILURE';

export const FETCH_VERIFICATION_STATUS = 'FETCH_VERIFICATION_STATUS';
export const FETCH_VERIFICATION_STATUS_SUCCESS =
  'FETCH_VERIFICATION_STATUS_SUCCESS';
export const FETCH_VERIFICATION_STATUS_FAILURE =
  'FETCH_VERIFICATION_STATUS_FAILURE';

export const VERIFICATION_STATUS_CORRECT = 'VERIFICATION_STATUS_CORRECT';
export const VERIFICATION_STATUS_INCORRECT = 'INVERIFICATION_STATUS_CORRECT';

export const UPDATE_VERIFICATION_STATUS = 'UPDATE_VERIFICATION_STATUS';
export const UPDATE_VERIFICATION_STATUS_SUCCESS =
  'UPDATE_VERIFICATION_STATUS_SUCCESS';
export const UPDATE_VERIFICATION_STATUS_FAILURE =
  'UPDATE_VERIFICATION_STATUS_FAILURE';

export const PAYMENT_STATUS = {
  ONGOING: 'PAYMENT_STATUS_ONGOING',
  PAUSED: 'PAYMENT_STATUS_PAUSED',
  SCO_PAUSED: 'PAYMENT_STATUS_SCO_PAUSED',
};

export const EDIT_MONTH_VERIFICATION = 'EDIT_MONTH_VERIFICATION';
export const UPDATE_VERIFICATION_STATUS_MONTHS = 'UPDATE_VERIFICATION_STATUS';

export function fetchPost911GiBillEligibility() {
  const POST_911_GI_BILL_ELIGIBILITY_ENDPOINT = `${
    environment.API_URL
  }/eligibility/post-911-gi-bill`;

  return async dispatch => {
    dispatch({ type: FETCH_POST_911_GI_BILL_ELIGIBILITY });

    return apiRequest(POST_911_GI_BILL_ELIGIBILITY_ENDPOINT)
      .then(response =>
        dispatch({
          type: FETCH_POST_911_GI_BILL_ELIGIBILITY_SUCCESS,
          response,
        }),
      )
      .catch(errors =>
        dispatch({
          type: FETCH_POST_911_GI_BILL_ELIGIBILITY_FAILURE,
          errors,
        }),
      );
  };
}

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

export function updateVerificationStatus(vs) {
  const VERIFICATION_STATUS_ENDPOINT = `${
    environment.API_URL
  }/attendance-verification/1/status`;
  // }/attendance-verification/${userId}/status`;

  // TODO The following is very much in-progress.
  // return async dispatch => {
  //   dispatch({ type: UPDATE_VERIFICATION_STATUS });
  return apiRequest(VERIFICATION_STATUS_ENDPOINT, {
    method: 'PUT',
    body: JSON.stringify(vs),
  })
    .then(
      () => window.console.log(UPDATE_VERIFICATION_STATUS_SUCCESS),
      // response => window.console.log(UPDATE_VERIFICATION_STATUS_SUCCESS),
      // dispatch({
      //   type: UPDATE_VERIFICATION_STATUS_SUCCESS,
      //   response,
      // }),
    )
    .catch(
      () => window.console.log(UPDATE_VERIFICATION_STATUS_FAILURE),
      // errors => window.console.log(UPDATE_VERIFICATION_STATUS_FAILURE),
      // dispatch({
      //   type: UPDATE_VERIFICATION_STATUS_FAILURE,
      //   errors,
      // }),
    );
  // };
}
