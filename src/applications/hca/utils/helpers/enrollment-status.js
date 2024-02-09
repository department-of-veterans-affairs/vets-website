import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';
import {
  ENROLLMENT_STATUS_ACTIONS,
  MOCK_ENROLLMENT_RESPONSE,
} from '../constants';

/**
 * Provide a mocked 404 response when calling the API endpoint
 * @param {Function} dispatch - tells the enrollment status reducer what
 * dataset to return
 */
export async function callFake404(dispatch) {
  const { FETCH_ENROLLMENT_STATUS_FAILED } = ENROLLMENT_STATUS_ACTIONS;
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  dispatch({
    type: FETCH_ENROLLMENT_STATUS_FAILED,
    errors: [{ code: '404' }],
  });
}

/**
 * Provide a mocked 200 response when calling the API endpoint
 * @param {Function} dispatch - tells the enrollment status reducer what
 * dataset to return
 * @param {String} status - the specific status code to use in the response
 */
export async function callFakeSuccess(dispatch, status) {
  const { FETCH_ENROLLMENT_STATUS_SUCCEEDED } = ENROLLMENT_STATUS_ACTIONS;
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  dispatch({
    type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    response: {
      ...MOCK_ENROLLMENT_RESPONSE,
      parsedStatus: status,
    },
  });
}

/**
 * Call the `/health_care_applications/enrollment_status` endpoint
 * @param {Function} dispatch - tells the enrollment status reducer what
 * dataset to return
 * @param {Object} formData - data object from the identity verification
 * form
 */
export function callAPI(dispatch, formData = {}) {
  const {
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    FETCH_ENROLLMENT_STATUS_FAILED,
  } = ENROLLMENT_STATUS_ACTIONS;
  const baseUrl = `/health_care_applications/enrollment_status`;
  const requestUrl = appendQuery(baseUrl, {
    'userAttributes[veteranDateOfBirth]': formData.dob,
    'userAttributes[veteranFullName][first]': formData.firstName,
    'userAttributes[veteranFullName][last]': formData.lastName,
    'userAttributes[veteranSocialSecurityNumber]': formData.ssn,
  });

  return apiRequest(requestUrl)
    .then(response =>
      dispatch({ type: FETCH_ENROLLMENT_STATUS_SUCCEEDED, response }),
    )
    .catch(({ errors }) =>
      dispatch({ type: FETCH_ENROLLMENT_STATUS_FAILED, errors }),
    );
}
