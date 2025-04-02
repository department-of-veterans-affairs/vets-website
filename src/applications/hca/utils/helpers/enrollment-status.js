import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';
import {
  API_ENDPOINTS,
  ENROLLMENT_STATUS_ACTIONS,
  MOCK_ENROLLMENT_RESPONSE,
} from '../constants';

const createRequestUrl = ({ dob, firstName, lastName, ssn }) =>
  appendQuery(API_ENDPOINTS.enrollmentStatus, {
    'userAttributes[veteranDateOfBirth]': dob,
    'userAttributes[veteranFullName][first]': firstName,
    'userAttributes[veteranFullName][last]': lastName,
    'userAttributes[veteranSocialSecurityNumber]': ssn,
  });

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

/**
 * Provide a mocked 404 response when calling the API endpoint
 * @param {Function} dispatch - tells the enrollment status reducer what
 * dataset to return
 */
export const callFake404 = async dispatch => {
  const { FETCH_ENROLLMENT_STATUS_FAILED } = ENROLLMENT_STATUS_ACTIONS;
  await sleep(1000);
  dispatch({
    type: FETCH_ENROLLMENT_STATUS_FAILED,
    errors: [{ code: '404' }],
  });
};

/**
 * Provide a mocked 200 response when calling the API endpoint
 * @param {Function} dispatch - tells the enrollment status reducer what
 * dataset to return
 * @param {String} status - the specific status code to use in the response
 */
export const callFakeSuccess = async (dispatch, status) => {
  const { FETCH_ENROLLMENT_STATUS_SUCCEEDED } = ENROLLMENT_STATUS_ACTIONS;
  await sleep(1000);
  dispatch({
    type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    response: {
      ...MOCK_ENROLLMENT_RESPONSE,
      parsedStatus: status,
    },
  });
};

/**
 * Call the API endpoint
 * @param {Function} dispatch - tells the enrollment status reducer what
 * dataset to return
 * @param {Object} formData - data object from the identity verification
 * form
 */
export const callAPI = async (dispatch, formData = {}) => {
  const { dob, firstName, lastName, ssn } = formData;
  const {
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    FETCH_ENROLLMENT_STATUS_FAILED,
  } = ENROLLMENT_STATUS_ACTIONS;
  const requestUrl = createRequestUrl({ dob, firstName, lastName, ssn });

  try {
    const response = await apiRequest(requestUrl);
    dispatch({ type: FETCH_ENROLLMENT_STATUS_SUCCEEDED, response });
  } catch ({ errors }) {
    dispatch({ type: FETCH_ENROLLMENT_STATUS_FAILED, errors });
  }
};
