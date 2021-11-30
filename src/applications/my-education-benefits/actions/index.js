import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const CLAIMANT_INTO_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/claimant_info`;

export const FETCH_PERSONAL_INFORMATION = 'FETCH_PERSONAL_INFORMATION';
export const FETCH_PERSONAL_INFORMATION_SUCCESS =
  'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_FAILED =
  'FETCH_PERSONAL_INFORMATION_FAILED';
export const FETCH_MILITARY_INFORMATION_SUCCESS =
  'FETCH_MILITARY_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_FAILED =
  'FETCH_MILITARY_INFORMATION_FAILED';

export const FETCH_CLAIM_STATUS = 'FETCH_CLAIM_STATUS';
export const FETCH_CLAIM_STATUS_SUCCESS = 'FETCH_CLAIM_STATUS_SUCCESS';
export const FETCH_CLAIM_STATUS_FAILURE = 'FETCH_CLAIM_STATUS_FAILURE';

export function fetchPersonalInformation() {
  return async dispatch => {
    dispatch({ type: FETCH_PERSONAL_INFORMATION });

    return apiRequest(CLAIMANT_INTO_ENDPOINT)
      .then(response =>
        dispatch({
          type: FETCH_PERSONAL_INFORMATION_SUCCESS,
          response,
        }),
      )
      .catch(errors =>
        dispatch({
          type: FETCH_PERSONAL_INFORMATION_FAILED,
          errors,
        }),
      );
  };
}

const poll = ({ endpoint, validate, interval, endTime, dispatch }) => {
  // eslint-disable-next-line consistent-return
  const executePoll = async (resolve, reject) => {
    const result = await apiRequest(endpoint);

    if (validate(result)) {
      return resolve('approved');
    } else if (new Date() >= endTime) {
      return reject('pending');
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll)
    .then(response => {
      return dispatch({
        type: FETCH_CLAIM_STATUS_SUCCESS,
        response,
      });
    })
    .catch(errors => {
      dispatch({
        type: FETCH_CLAIM_STATUS_FAILURE,
        errors,
      });
    });
};

const validateClaimStatusResponse = response => response && response.condition;
const POLL_INTERVAL = 5000;
const CLAIM_STATUS_ENDPOINT = CLAIMANT_INTO_ENDPOINT;

export function fetchClaimStatus() {
  return async dispatch => {
    dispatch({ type: FETCH_CLAIM_STATUS });
    const ONE_MINUTE_IN_THE_FUTURE = new Date(new Date().getTime() + 60000);

    poll({
      endpoint: CLAIM_STATUS_ENDPOINT,
      validate: validateClaimStatusResponse,
      interval: POLL_INTERVAL,
      endTime: ONE_MINUTE_IN_THE_FUTURE,
      dispatch,
    });
  };
}
