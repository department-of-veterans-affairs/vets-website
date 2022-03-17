import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const CLAIMANT_INFO_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/claimant_info`;

// const CLAIM_STATUS_ENDPOINT = `${environment.API_URL}/meb_api/v0/claim_status`;

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

// export const FETCH_CLAIM_STATUS = 'FETCH_CLAIM_STATUS';
// export const FETCH_CLAIM_STATUS_SUCCESS = 'FETCH_CLAIM_STATUS_SUCCESS';
// export const FETCH_CLAIM_STATUS_FAILURE = 'FETCH_CLAIM_STATUS_FAILURE';

// export const CLAIM_STATUS_RESPONSE_ELIGIBLE = 'ELIGIBLE';
// export const CLAIM_STATUS_RESPONSE_DENIED = 'DENIED';
// export const CLAIM_STATUS_RESPONSE_IN_PROGRESS = 'INPROGRESS';
// export const CLAIM_STATUS_RESPONSE_ERROR = 'ERROR';

// export const FETCH_ELIGIBILITY = 'FETCH_ELIGIBILITY';
// export const FETCH_ELIGIBILITY_SUCCESS = 'FETCH_ELIGIBILITY_SUCCESS';
// export const FETCH_ELIGIBILITY_FAILURE = 'FETCH_ELIGIBILITY_FAILURE';
// export const ELIGIBILITY = {
//   CHAPTER30: 'Chapter30',
//   CHAPTER33: 'Chapter33',
//   CHAPTER1606: 'Chapter1606',
// };

// const FIVE_SECONDS = 5000;
// const ONE_MINUTE_IN_THE_FUTURE = () => {
//   return new Date(new Date().getTime() + 60000);
// };

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
