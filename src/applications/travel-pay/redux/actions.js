import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const FETCH_TRAVEL_CLAIMS_STARTED = 'FETCH_TRAVEL_CLAIMS_STARTED';
export const FETCH_TRAVEL_CLAIMS_SUCCESS = 'FETCH_TRAVEL_CLAIMS_SUCCESS';
export const FETCH_TRAVEL_CLAIMS_FAILURE = 'FETCH_TRAVEL_CLAIMS_FAILURE';

export const FETCH_UNAUTH_PING_STARTED = 'FETCH_UNAUTH_PING_STARTED';
export const FETCH_UNAUTH_PING_SUCCESS = 'FETCH_UNAUTH_PING_SUCCESS';
export const FETCH_UNAUTH_PING_FAILURE = 'FETCH_UNAUTH_PING_FAILURE';

const fetchTravelClaimsStart = () => ({ type: FETCH_TRAVEL_CLAIMS_STARTED });
const fetchTravelClaimsSuccess = data => ({
  type: FETCH_TRAVEL_CLAIMS_SUCCESS,
  payload: data,
});
const fetchTravelClaimsFailure = error => ({
  type: FETCH_TRAVEL_CLAIMS_FAILURE,
  error,
});

const fetchUnauthPingStart = () => ({ type: FETCH_UNAUTH_PING_STARTED });
const fetchUnauthPingSuccess = data => ({
  type: FETCH_UNAUTH_PING_SUCCESS,
  payload: data,
});
const fetchUnauthPingFailure = error => ({
  type: FETCH_UNAUTH_PING_FAILURE,
  error,
});

export function getTravelClaims() {
  return async dispatch => {
    dispatch(fetchTravelClaimsStart());

    try {
      const claimsUrl = `${environment.API_URL}/travel_pay/claims`;
      const response = await apiRequest(claimsUrl);

      dispatch(fetchTravelClaimsSuccess(response.data));
    } catch (error) {
      dispatch(fetchTravelClaimsFailure(error));
    }
  };
}

export function getUnauthPing() {
  return async dispatch => {
    dispatch(fetchUnauthPingStart());

    try {
      const absoluteURL = `${environment.API_URL}/travel_pay/pings/ping`;
      const response = await apiRequest(absoluteURL);

      dispatch(fetchUnauthPingSuccess(response.data));
    } catch (error) {
      dispatch(fetchUnauthPingFailure(error));
    }
  };
}
