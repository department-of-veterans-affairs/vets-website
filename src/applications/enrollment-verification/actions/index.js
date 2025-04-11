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
export const VERIFICATION_STATUS_INCORRECT = 'VERIFICATION_STATUS_INCORRECT';

export const UPDATE_VERIFICATION_STATUS = 'UPDATE_VERIFICATION_STATUS';
export const UPDATE_VERIFICATION_STATUS_SUCCESS =
  'UPDATE_VERIFICATION_STATUS_SUCCESS';
export const UPDATE_VERIFICATION_STATUS_FAILURE =
  'UPDATE_VERIFICATION_STATUS_FAILURE';

export const EDIT_MONTH_VERIFICATION = 'EDIT_MONTH_VERIFICATION';
export const UPDATE_VERIFICATION_STATUS_MONTHS =
  'UPDATE_VERIFICATION_STATUS_MONTHS';

export function fetchPost911GiBillEligibility() {
  const POST_911_GI_BILL_ELIGIBILITY_ENDPOINT = `${environment.API_URL}/meb_api/v0/enrollment`;

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

export function postEnrollmentVerifications(vs) {
  const VERIFICATION_STATUS_ENDPOINT = `${environment.API_URL}/meb_api/v0/submit_enrollment_verification`;

  return async dispatch => {
    dispatch({ type: UPDATE_VERIFICATION_STATUS });

    return apiRequest(VERIFICATION_STATUS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        enrollmentVerifications: vs,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response =>
        dispatch({
          type: UPDATE_VERIFICATION_STATUS_SUCCESS,
          response,
        }),
      )
      .catch(errors =>
        dispatch({
          type: UPDATE_VERIFICATION_STATUS_FAILURE,
          errors,
        }),
      );
  };
}
