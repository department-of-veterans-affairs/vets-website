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
  window.console.log('Start poll...');

  // eslint-disable-next-line consistent-return
  const executePoll = async (resolve, reject) => {
    window.console.log('- poll');
    const result = await apiRequest(endpoint);

    if (validate(result)) {
      window.console.log('Return resolve');
      return resolve('approved');
    } else if (new Date() >= endTime) {
      window.console.log('pretend success');
      return resolve('approved');
      // window.console.log('Return reject');
      // return reject('Exceeded end time.');
    } else {
      window.console.log('Set timeout');
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll)
    .then(response => {
      window.console.log('dispatch success');
      return dispatch({
        type: FETCH_CLAIM_STATUS_SUCCESS,
        response,
      });
    })
    .catch(errors => {
      window.console.log('dispatch failure');
      dispatch({
        type: FETCH_CLAIM_STATUS_FAILURE,
        errors,
      });
    });
};

const validateClaimStatusResponse = response => response && response.condition;
const POLL_INTERVAL = 1000; // Just for testing. Will be 5000.
const CLAIM_STATUS_ENDPOINT = CLAIMANT_INTO_ENDPOINT;

export function fetchClaimStatus() {
  return async dispatch => {
    dispatch({ type: FETCH_CLAIM_STATUS });
    // const ONE_MINUTE_IN_THE_FUTURE = new Date(new Date().getTime() + 60000);
    const FIVE_SECONDS_IN_THE_FUTURE = new Date(new Date().getTime() + 5000);

    poll({
      endpoint: CLAIM_STATUS_ENDPOINT,
      validate: validateClaimStatusResponse,
      interval: POLL_INTERVAL,
      endTime: FIVE_SECONDS_IN_THE_FUTURE,
      dispatch,
    });
  };
}
