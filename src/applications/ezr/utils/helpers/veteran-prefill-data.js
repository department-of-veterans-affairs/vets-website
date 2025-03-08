import { apiRequest } from 'platform/utilities/api';
import {
  VETERAN_PREFILL_DATA_ACTIONS,
  MOCK_VETERAN_PREFILL_DATA_RESPONSE,
} from '../constants';

/**
 * Provide a mocked 200 response when calling the API endpoint
 * @param {Function} dispatch - tells the veteran prefill data reducer
 * what dataset to return
 * @param {String} type - the dispatch type to call
 */
export function callFakeSuccess(dispatch) {
  const { FETCH_VETERAN_PREFILL_DATA_SUCCEEDED } = VETERAN_PREFILL_DATA_ACTIONS;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    dispatch({
      type: FETCH_VETERAN_PREFILL_DATA_SUCCEEDED,
      response: {
        parsedData: MOCK_VETERAN_PREFILL_DATA_RESPONSE,
      },
    });
  });
}

/**
 * Call the `/form1010_ezrs/veteran_prefill_data` endpoint
 * @param {Function} dispatch - tells the veteran prefill data reducer what data
 * set to return
 * @param {Object} formData - data object from the ID form fields
 */
export function fetchVeteranPrefillData(dispatch) {
  const {
    FETCH_VETERAN_PREFILL_DATA_SUCCEEDED,
    FETCH_VETERAN_PREFILL_DATA_FAILED,
  } = VETERAN_PREFILL_DATA_ACTIONS;
  const requestUrl = `/form1010_ezrs/veteran_prefill_data`;

  return apiRequest(requestUrl)
    .then(response =>
      dispatch({ type: FETCH_VETERAN_PREFILL_DATA_SUCCEEDED, response }),
    )
    .catch(({ errors }) =>
      dispatch({ type: FETCH_VETERAN_PREFILL_DATA_FAILED, errors }),
    );
}
