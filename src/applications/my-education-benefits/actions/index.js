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
export const FETCH_DIRECT_DEPOSIT = 'FETCH_DIRECT_DEPOSIT';
export const FETCH_DIRECT_DEPOSIT_SUCCESS = 'FETCH_DIRECT_DEPOSIT_SUCCESS';
export const FETCH_DIRECT_DEPOSIT_FAILED = 'FETCH_DIRECT_DEPOSIT_FAILED';

export const FETCH_EXCLUSION_PERIODS = 'FETCH_EXCLUSION_PERIODS';
export const FETCH_EXCLUSION_PERIODS_SUCCESS =
  'FETCH_EXCLUSION_PERIODS_SUCCESS';
export const FETCH_EXCLUSION_PERIODS_FAILURE =
  'FETCH_EXCLUSION_PERIODS_FAILURE';
export const EXCLUSION_PERIODS_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/exclusion_periods`;
export const DIRECT_DEPOSIT_ENDPOINT = `${
  environment.API_URL
}/v0/profile/ch33_bank_accounts`;

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

export const DUPLICATE_CONTACT_INFO_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/duplicate_contact_info`;
export const FETCH_DUPLICATE_CONTACT = 'FETCH_DUPLICATE_CONTACT';
export const FETCH_DUPLICATE_CONTACT_INFO_SUCCESS =
  'FETCH_DUPLICATE_CONTACT_INFO_SUCCESS';
export const FETCH_DUPLICATE_CONTACT_INFO_FAILURE =
  'FETCH_DUPLICATE_CONTACT_INFO_FAILURE';
export const UPDATE_GLOBAL_EMAIL = 'UPDATE_GLOBAL_EMAIL';
export const UPDATE_GLOBAL_PHONE_NUMBER = 'UPDATE_GLOBAL_PHONE_NUMBER';
export const ACKNOWLEDGE_DUPLICATE = 'ACKNOWLEDGE_DUPLICATE';
export const TOGGLE_MODAL = 'TOGGLE_MODAL';
const FIVE_SECONDS = 5000;
const ONE_MINUTE_IN_THE_FUTURE = () => {
  return new Date(new Date().getTime() + 60000);
};
export function fetchPersonalInformation(showMebEnhancements09) {
  return async dispatch => {
    dispatch({ type: FETCH_PERSONAL_INFORMATION });
    return apiRequest(CLAIMANT_INFO_ENDPOINT)
      .then(response => {
        if (!response?.data?.attributes?.claimant && !showMebEnhancements09) {
          window.location.href =
            '/education/apply-for-education-benefits/application/1990/';
        }
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
        if (!showMebEnhancements09) {
          window.location.href =
            '/education/apply-for-education-benefits/application/1990/';
        }
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
export function fetchDirectDeposit() {
  return async dispatch => {
    dispatch({ type: FETCH_DIRECT_DEPOSIT });
    return apiRequest(DIRECT_DEPOSIT_ENDPOINT)
      .then(response => {
        dispatch({
          type: FETCH_DIRECT_DEPOSIT_SUCCESS,
          response,
        });
      })
      .catch(errors => {
        dispatch({
          type: FETCH_DIRECT_DEPOSIT_FAILED,
          errors,
        });
      });
  };
}
export function fetchDuplicateContactInfo(email, phoneNumber) {
  return async dispatch => {
    dispatch({ type: FETCH_DUPLICATE_CONTACT });
    return apiRequest(DUPLICATE_CONTACT_INFO_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        emails: email,
        phones: phoneNumber,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response =>
        dispatch({
          type: FETCH_DUPLICATE_CONTACT_INFO_SUCCESS,
          response,
        }),
      )
      .catch(errors =>
        dispatch({
          type: FETCH_DUPLICATE_CONTACT_INFO_FAILURE,
          errors,
        }),
      );
  };
}
export function fetchExclusionPeriods() {
  return async dispatch => {
    dispatch({ type: FETCH_EXCLUSION_PERIODS });
    try {
      const response = await apiRequest(EXCLUSION_PERIODS_ENDPOINT);
      dispatch({
        type: FETCH_EXCLUSION_PERIODS_SUCCESS,
        response,
      });
    } catch (error) {
      dispatch({
        type: FETCH_EXCLUSION_PERIODS_FAILURE,
        error,
      });
    }
  };
}
export function updateGlobalEmail(email) {
  return {
    type: UPDATE_GLOBAL_EMAIL,
    email,
  };
}
export function updateGlobalPhoneNumber(mobilePhone) {
  return {
    type: UPDATE_GLOBAL_PHONE_NUMBER,
    mobilePhone,
  };
}
export function acknowledgeDuplicate(contactInfo) {
  return {
    type: ACKNOWLEDGE_DUPLICATE,
    contactInfo,
  };
}
export function toggleModal(toggle) {
  return {
    type: TOGGLE_MODAL,
    toggle,
  };
}
