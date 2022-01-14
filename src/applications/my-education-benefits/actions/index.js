import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const CLAIMANT_INTO_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/claimant_info`;

const CLAIM_STATUS_ENDPOINT = `${environment.API_URL}/meb_api/v0/claim_status`;

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

export const CLAIM_STATUS_RESPONSE_ELIGIBLE = 'ELIGIBLE';
export const CLAIM_STATUS_RESPONSE_DENIED = 'DENIED';
export const CLAIM_STATUS_RESPONSE_IN_PROGRESS = 'INPROGRESS';
export const CLAIM_STATUS_RESPONSE_ERROR = 'ERROR';

const ONE_MINUTE_IN_THE_FUTURE = new Date(new Date().getTime() + 60000);
const FIVE_SECONDS = 5000;

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

const poll = ({
  endpoint,
  validate,
  interval = FIVE_SECONDS,
  endTime = ONE_MINUTE_IN_THE_FUTURE,
  dispatch,
  timeoutResponse,
}) => {
  // eslint-disable-next-line consistent-return
  const executePoll = async (resolve, reject) => {
    const response = await apiRequest(endpoint);

    if (validate(response)) {
      return resolve(response.data);
    } else if (new Date() >= endTime) {
      return resolve(timeoutResponse);
    }

    setTimeout(executePoll, interval, resolve, reject);
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

export function fetchClaimStatus() {
  return async dispatch => {
    dispatch({ type: FETCH_CLAIM_STATUS });
    const timeoutResponse = {
      claimStatus: CLAIM_STATUS_RESPONSE_IN_PROGRESS,
      receivedDate: Date.now(),
    };

    poll({
      endpoint: CLAIM_STATUS_ENDPOINT,
      validate: response =>
        response.data.attributes &&
        response.data.attributes.claimStatus !==
          CLAIM_STATUS_RESPONSE_IN_PROGRESS,
      dispatch,
      timeoutResponse,
    });
  };
}
