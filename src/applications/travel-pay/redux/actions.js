import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const FETCH_TRAVEL_CLAIMS_STARTED = 'FETCH_TRAVEL_CLAIMS_STARTED';
export const FETCH_TRAVEL_CLAIMS_SUCCESS = 'FETCH_TRAVEL_CLAIMS_SUCCESS';
export const FETCH_TRAVEL_CLAIMS_FAILURE = 'FETCH_TRAVEL_CLAIMS_FAILURE';
export const FETCH_APPOINTMENT_STARTED = 'FETCH_APPOINTMENT_STARTED';
export const FETCH_APPOINTMENT_SUCCESS = 'FETCH_APPOINTMENT_SUCCESS';
export const FETCH_APPOINTMENT_FAILURE = 'FETCH_APPOINTMENT_FAILURE';
export const SUBMIT_CLAIM_STARTED = 'SUBMIT_CLAIM_STARTED';
export const SUBMIT_CLAIM_SUCCESS = 'SUBMIT_CLAIM_SUCCESS';
export const SUBMIT_CLAIM_FAILURE = 'SUBMIT_CLAIM_FAILURE';

const fetchTravelClaimsStart = () => ({ type: FETCH_TRAVEL_CLAIMS_STARTED });
const fetchTravelClaimsSuccess = data => ({
  type: FETCH_TRAVEL_CLAIMS_SUCCESS,
  payload: data,
});
const fetchTravelClaimsFailure = error => ({
  type: FETCH_TRAVEL_CLAIMS_FAILURE,
  error,
});

export function getTravelClaims() {
  return async dispatch => {
    dispatch(fetchTravelClaimsStart());

    try {
      const claimsUrl = `${environment.API_URL}/travel_pay/v0/claims`;
      const response = await apiRequest(claimsUrl);

      dispatch(fetchTravelClaimsSuccess(response.data));
    } catch (error) {
      dispatch(fetchTravelClaimsFailure(error));
    }
  };
}

const fetchAppointmentStart = () => ({ type: FETCH_APPOINTMENT_STARTED });
const fetchAppointmentSuccess = data => ({
  type: FETCH_APPOINTMENT_SUCCESS,
  payload: data,
});
const fetchAppointmentFailure = error => ({
  type: FETCH_APPOINTMENT_FAILURE,
  error,
});

export function getAppointmentData(apptId) {
  return async dispatch => {
    dispatch(fetchAppointmentStart());
    try {
      const apptUrl = `${
        environment.API_URL
      }/vaos/v2/appointments/${apptId}?_include=facilities,travel_pay_claims`;
      const response = await apiRequest(apptUrl);
      dispatch(fetchAppointmentSuccess(response.data.attributes));
    } catch (error) {
      dispatch(fetchAppointmentFailure(error));
    }
  };
}

const submitClaimStart = () => ({ type: SUBMIT_CLAIM_STARTED });
const submitClaimSuccess = data => ({
  type: SUBMIT_CLAIM_SUCCESS,
  payload: data,
});
const submitClaimFailure = error => ({
  type: SUBMIT_CLAIM_FAILURE,
  error,
});

export function submitMileageOnlyClaim(datetime) {
  return async dispatch => {
    dispatch(submitClaimStart());
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ appointmentDatetime: datetime }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const apptUrl = `${environment.API_URL}/travel_pay/v0/claims`;
      const response = await apiRequest(apptUrl, options);
      dispatch(submitClaimSuccess(response));
    } catch (error) {
      dispatch(submitClaimFailure(error));
    }
  };
}
