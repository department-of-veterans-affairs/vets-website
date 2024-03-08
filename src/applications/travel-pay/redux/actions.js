import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

export const FETCH_TRAVEL_CLAIMS_STARTED = 'TRAVEL_CLAIMS_INIT';
export const FETCH_TRAVEL_CLAIMS_SUCCESS = 'TRAVEL_CLAIMS_SUCCESS';
export const FETCH_TRAVEL_CLAIMS_FAILURE = 'TRAVEL_CLAIMS_FAILURE';

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
      const sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms));
      };
      await sleep(3000);
      dispatch(fetchTravelClaimsSuccess(response.data));
    } catch (error) {
      dispatch(fetchTravelClaimsFailure(error));
    }
  };
}
