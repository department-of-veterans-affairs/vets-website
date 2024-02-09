import environment from 'platform/utilities/environment';
import { isEnrollmentStatusLoading } from '../selectors';
import {
  HCA_ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_ACTIONS,
} from '../constants';
import {
  callAPI,
  callFake404,
  callFakeSuccess,
} from '../helpers/enrollment-status';

/**
 * Action to fetch the current enrollment status based on the provided user data
 *
 * NOTE: flip `simulate` variable to `true` to fake the endpoint when testing locally
 *
 * @param {Object} formData - data object from the identity verification form
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for enrollment status
 */
export function getEnrollmentStatus(
  formData = {},
  env = environment,
  simulate = false,
) {
  return (dispatch, getState) => {
    const isLoading = isEnrollmentStatusLoading(getState());
    if (isLoading) return null;

    const simulateServerLocally = env.isLocalhost() && simulate;
    const { FETCH_ENROLLMENT_STATUS_STARTED } = ENROLLMENT_STATUS_ACTIONS;

    dispatch({ type: FETCH_ENROLLMENT_STATUS_STARTED });

    /*
    When hitting the API locally, we cannot get responses other than 500s from
    the endpoint due to the endpoint's need to connect to MVI. To get around this, 
    confirm that `simulateServerLocally` evals to `true` and then optionally adjust 
    what the `callFakeSuccess` functions return.
    */

    if (simulateServerLocally) {
      const { firstName } = formData;
      return firstName?.toLowerCase() === 'patrick'
        ? callFake404(dispatch)
        : callFakeSuccess(dispatch, HCA_ENROLLMENT_STATUSES.enrolled);
    }

    return callAPI(dispatch, formData);
  };
}

/**
 * Action to reset the enrollment status state to its initial value
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for enrollment status
 */
export function resetEnrollmentStatus() {
  return dispatch => {
    const { RESET_ENROLLMENT_STATUS } = ENROLLMENT_STATUS_ACTIONS;
    dispatch({ type: RESET_ENROLLMENT_STATUS });
  };
}

/**
 * Declare action type to determine if users can be shown content on how to reapply for benefits
 * @returns {Object} - object containing the constant string to use in a fetch action
 */
export function showReapplyContent() {
  const { SHOW_REAPPLY_CONTENT } = ENROLLMENT_STATUS_ACTIONS;
  return { type: SHOW_REAPPLY_CONTENT };
}
