import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const CLAIMANT_INFO_ENDPOINT = `${
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

const ELIGIBILITY_ENDPOINT = `${environment.API_URL}/meb_api/v0/eligibility`;
export const FETCH_ELIGIBILITY = 'FETCH_ELIGIBILITY';
export const FETCH_ELIGIBILITY_SUCCESS = 'FETCH_ELIGIBILITY_SUCCESS';
export const FETCH_ELIGIBILITY_FAILURE = 'FETCH_ELIGIBILITY_FAILURE';
export const ELIGIBILITY = {
  CHAPTER30: 'Chapter30',
  CHAPTER33: 'Chapter33',
  CHAPTER1606: 'Chapter1606',
};

const FIVE_SECONDS = 5000;
const ONE_MINUTE_IN_THE_FUTURE = () => {
  return new Date(new Date().getTime() + 60000);
};

export function fetchPersonalInformation() {
  return async dispatch => {
    dispatch({ type: FETCH_PERSONAL_INFORMATION });
    return apiRequest(CLAIMANT_INFO_ENDPOINT)
      .then(response => {
        if (!response?.data?.attributes?.claimant) {
          window.location.href =
            '/education/apply-for-education-benefits/application/1990/';
        } else {
          dispatch({
            type: FETCH_PERSONAL_INFORMATION_SUCCESS,
            response,
          });
        }
      })
      .catch(errors => {
        dispatch({
          type: FETCH_PERSONAL_INFORMATION_FAILED,
          errors,
        });
        window.location.href =
          '/education/apply-for-education-benefits/application/1990/';
      });
  };
}

const poll = ({
  endpoint,
  validate = response => response && response.data,
  interval = FIVE_SECONDS,
  endTime = ONE_MINUTE_IN_THE_FUTURE(),
  dispatch,
  timeoutResponse,
  successDispatchType,
  failureDispatchType,
}) => {
  // eslint-disable-next-line consistent-return
  const executePoll = async (resolve, reject) => {
    const response = await apiRequest(endpoint);

    if (validate(response)) {
      return resolve(response.data);
    }
    if (new Date() >= endTime) {
      return resolve(timeoutResponse);
    }

    setTimeout(executePoll, interval, resolve, reject);
  };

  return new Promise(executePoll)
    .then(response => {
      return dispatch({
        type: successDispatchType,
        response,
      });
    })
    .catch(errors => {
      dispatch({
        type: failureDispatchType,
        errors,
      });
    });
};

function getNowDate() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function fetchClaimStatus() {
  return async dispatch => {
    dispatch({ type: FETCH_CLAIM_STATUS });
    const timeoutResponse = {
      attributes: {
        claimStatus: CLAIM_STATUS_RESPONSE_IN_PROGRESS,
        receivedDate: getNowDate(),
      },
    };

    poll({
      endpoint: CLAIM_STATUS_ENDPOINT,
      validate: response =>
        response?.data?.attributes?.claimStatus &&
        response.data.attributes.claimStatus !==
          CLAIM_STATUS_RESPONSE_IN_PROGRESS,
      dispatch,
      timeoutResponse,
      successDispatchType: FETCH_CLAIM_STATUS_SUCCESS,
      failureDispatchType: FETCH_CLAIM_STATUS_FAILURE,
    });
  };
}

export function fetchEligibility() {
  return async dispatch => {
    dispatch({ type: FETCH_ELIGIBILITY });

    return apiRequest(ELIGIBILITY_ENDPOINT)
      .then(response =>
        dispatch({
          type: FETCH_ELIGIBILITY_SUCCESS,
          response,
        }),
      )
      .catch(errors =>
        dispatch({
          type: FETCH_ELIGIBILITY_FAILURE,
          errors,
        }),
      );
  };
}
