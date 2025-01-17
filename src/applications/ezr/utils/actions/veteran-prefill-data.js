import environment from 'platform/utilities/environment';
import { selectVeteranPrefillData } from '../selectors/veteran-prefill-data';
import { VETERAN_PREFILL_DATA_ACTIONS } from '../constants';
import {
  fetchVeteranPrefillData,
  callFakeSuccess,
} from '../helpers/veteran-prefill-data';

/**
 * Action to fetch the current enrollment status based on the provided user data
 *
 * NOTE: flip `simulate` variable to `true` to fake the endpoint when testing locally
 *
 * @param {Object} formData - data object from the ID form fields
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for enrollment status
 */
export function fetchVeteranPrefillDataAction(
  env = environment,
  simulate = false,
) {
  return (dispatch, getState) => {
    const { isLoading } = selectVeteranPrefillData(getState());
    if (isLoading) return null;

    const simulateServerLocally = env.isLocalhost() && simulate;
    const { FETCH_VETERAN_PREFILL_DATA_STARTED } = VETERAN_PREFILL_DATA_ACTIONS;

    dispatch({ type: FETCH_VETERAN_PREFILL_DATA_STARTED });

    /*
    When hitting the API locally, we cannot get responses other than 500s from
    the endpoint due to the endpoint's need to connect to MVI. To get around this,
    confirm that `simulateServerLocally` evals to `true` and then optionally adjust
    what the `callFakeSuccess` functions return.
    */

    return simulateServerLocally
      ? callFakeSuccess(dispatch)
      : fetchVeteranPrefillData(dispatch);
  };
}
