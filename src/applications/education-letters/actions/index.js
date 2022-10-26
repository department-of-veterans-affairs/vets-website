import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const MEB_CLAIM_STATUS_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/claim_status`;
export const TOE_CLAIM_STATUS_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/forms_claim_status`;

export const CLAIM_STATUSES = [];

export const FETCH_CLAIM_STATUS = 'FETCH_CLAIM_STATUS';
export const FETCH_CLAIM_STATUS_SUCCESS = 'FETCH_CLAIM_STATUS_SUCCESS';
export const FETCH_CLAIM_STATUS_FAILED = 'FETCH_CLAIM_STATUS_FAILED';

const fetchAPIs = (endpoints, dispatch) =>
  endpoints
    .map(endpoint =>
      apiRequest(endpoint)
        .then(response => {
          dispatch({
            type: FETCH_CLAIM_STATUS_SUCCESS,
            response,
          });
        })
        .catch(errors => {
          dispatch({
            type: FETCH_CLAIM_STATUS_FAILED,
            errors,
          });
        }),
    )
    .reduce((currentDate, nextDate) => {
      return currentDate?.claimStatus?.receivedDate >
        nextDate?.claimStatus?.receivedDate
        ? currentDate
        : nextDate;
    });

export function fetchClaimStatus() {
  return async dispatch => {
    dispatch({ type: FETCH_CLAIM_STATUS });
    return fetchAPIs(
      [MEB_CLAIM_STATUS_ENDPOINT, TOE_CLAIM_STATUS_ENDPOINT],
      dispatch,
    );
  };
}
