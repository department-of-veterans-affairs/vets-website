import environment from 'platform/utilities/environment';
import { selectEnrollmentStatus } from '../selectors/entrollment-status';
import { ENROLLMENT_STATUS_ACTIONS } from '../constants';
import { callAPI, callFakeSuccess } from '../helpers/enrollment-status';

/**
 * Action to fetch the current enrollment status based on the provided user data
 *
 * NOTE: flip `simulate` variable to `true` to fake the endpoint when testing locally
 *
 * @param {Object} formData - data object from the ID form fields
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for enrollment status
 */
export function fetchEnrollmentStatus(env = environment, simulate = false) {
  return (dispatch, getState) => {
    const { isLoading } = selectEnrollmentStatus(getState());
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

    return simulateServerLocally
      ? callFakeSuccess(dispatch)
      : callAPI(dispatch);
  };
}
