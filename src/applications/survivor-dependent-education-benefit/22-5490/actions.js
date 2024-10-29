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

export const LIGHTHOUSE_DIRECT_DEPOSIT_ENDPOINT = `${
  environment.API_URL
}/v0/profile/direct_deposits`;

export const CLAIM_STATUS_ENDPOINT = `${
  environment.API_URL
}/meb_api/v0/forms_claim_status`;
export const CLAIM_STATUS_RESPONSE_IN_PROGRESS = 'INPROGRESS';
export const FETCH_CLAIM_STATUS = 'FETCH_CLAIM_STATUS';
export const FETCH_CLAIM_STATUS_SUCCESS = 'FETCH_CLAIM_STATUS_SUCCESS';
export const FETCH_CLAIM_STATUS_FAILURE = 'FETCH_CLAIM_STATUS_FAILURE';

const FIVE_SECONDS = 5000;
const ONE_MINUTE_IN_THE_FUTURE = () => {
  return new Date(new Date().getTime() + FIVE_SECONDS * 12);
};
function getNowDate() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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

export function fetchClaimStatus(selectedChapter) {
  return async dispatch => {
    dispatch({ type: FETCH_CLAIM_STATUS });
    const timeoutResponse = {
      attributes: {
        claimStatus: CLAIM_STATUS_RESPONSE_IN_PROGRESS,
        receivedDate: getNowDate(),
      },
    };

    poll({
      endpoint: `${CLAIM_STATUS_ENDPOINT}?type=${selectedChapter}`,
      validate: response => {
        return (
          response?.data?.attributes?.claimStatus &&
          response.data.attributes.claimStatus !==
            CLAIM_STATUS_RESPONSE_IN_PROGRESS
        );
      },
      dispatch,
      timeoutResponse,
      successDispatchType: FETCH_CLAIM_STATUS_SUCCESS,
      failureDispatchType: FETCH_CLAIM_STATUS_FAILURE,
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
