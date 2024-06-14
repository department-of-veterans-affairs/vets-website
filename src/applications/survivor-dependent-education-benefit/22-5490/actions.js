import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const CLAIMANT_INFO_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/forms_claimant_info`;

export const FETCH_PERSONAL_INFORMATION = 'FETCH_PERSONAL_INFORMATION';
export const FETCH_PERSONAL_INFORMATION_SUCCESS =
  'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_FAILED =
  'FETCH_PERSONAL_INFORMATION_FAILED';

export const LIGHTHOUSE_DIRECT_DEPOSIT_ENDPOINT = `${
  environment.API_URL
}/v0/profile/direct_deposits`;

// const FIVE_SECONDS = 5000;
// const ONE_MINUTE_IN_THE_FUTURE = () => {
//   return new Date(new Date().getTime() + FIVE_SECONDS * 12);
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

// export function fetchDirectDeposit() {
//   const ddEndpoint = LIGHTHOUSE_DIRECT_DEPOSIT_ENDPOINT

//   return async dispatch => {
//     dispatch({ type: FETCH_DIRECT_DEPOSIT });

//     return apiRequest(ddEndpoint)
//       .then(response => {
//         dispatch({
//           type: FETCH_DIRECT_DEPOSIT_SUCCESS,
//           response,
//         });
//       })
//       .catch(errors => {
//         dispatch({
//           type: FETCH_DIRECT_DEPOSIT_FAILED,
//           errors,
//         });
//       });
//   };
// }
