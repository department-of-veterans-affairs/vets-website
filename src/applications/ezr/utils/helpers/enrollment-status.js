import { apiRequest } from 'platform/utilities/api';
import {
  ENROLLMENT_STATUS_ACTIONS,
  MOCK_ENROLLMENT_RESPONSE,
} from '../constants';

/**
 * Provide a mocked 200 response when calling the API endpoint
 * @param {Function} dispatch - tells the enrollment status reducer
 * what dataset to return
 * @param {String} type - the dispatch type to call
 */
export function callFakeSuccess(dispatch) {
  const { FETCH_ENROLLMENT_STATUS_SUCCEEDED } = ENROLLMENT_STATUS_ACTIONS;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    dispatch({
      type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
      response: MOCK_ENROLLMENT_RESPONSE,
    });
  });
}

/**
 * Call the `/health_care_applications/enrollment_status` endpoint
 * @param {Function} dispatch - tells the enrollment status reducer what data
 * set to return
 * @param {Object} formData - data object from the ID form fields
 */
export function callAPI(dispatch) {
  const {
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    FETCH_ENROLLMENT_STATUS_FAILED,
  } = ENROLLMENT_STATUS_ACTIONS;
  const requestUrl = `/health_care_applications/enrollment_status`;

  return apiRequest(requestUrl)
    .then(response =>
      dispatch({ type: FETCH_ENROLLMENT_STATUS_SUCCEEDED, response }),
    )
    .catch(({ errors }) =>
      dispatch({ type: FETCH_ENROLLMENT_STATUS_FAILED, errors }),
    );
}
