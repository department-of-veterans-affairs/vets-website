import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

export const FETCH_TRAVEL_CLAIMS_STARTED = 'FETCH_TRAVEL_CLAIMS_STARTED';
export const FETCH_TRAVEL_CLAIMS_SUCCESS = 'FETCH_TRAVEL_CLAIMS_SUCCESS';
export const FETCH_TRAVEL_CLAIMS_FAILURE = 'FETCH_TRAVEL_CLAIMS_FAILURE';

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
      const response = await apiRequest('/travel-claims');

      dispatch(fetchTravelClaimsSuccess(response.data));
    } catch (error) {
      dispatch(fetchTravelClaimsFailure(error));
    }
  };
}
