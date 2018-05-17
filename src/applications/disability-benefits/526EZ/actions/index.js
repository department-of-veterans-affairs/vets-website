import Raven from 'raven-js';

import recordEvent from '../../../../platform/monitoring/record-event';
import { apiRequest, getStatus } from '../../../letters/utils/helpers.jsx';

import {
  GET_ADDRESS_COUNTRIES_FAILURE,
  GET_ADDRESS_COUNTRIES_SUCCESS,
  GET_ADDRESS_STATES_FAILURE,
  GET_ADDRESS_STATES_SUCCESS,
} from '../../../letters/utils/constants';

import { mergeAndLabelStateCodes } from '../helpers';
/* eslint-disable no-unused-vars */

export const ITFStatuses = Object.freeze({
  active: 'active',
  claim_received: 'claim_received', // eslint-disable-line camelcase
  duplicate: 'duplicate',
  expired: 'expired',
  pending: 'pending',
  incomplete: 'incomplete'
});


// TODO: replace mock once ITF endpoint setup
export function submitIntentToFile(formConfig, onChange) {
  const { intentToFileUrl, formId, migrations, prefillTransformer } = formConfig;
  let ITFStatus = ITFStatuses.pending;
  return dispatch => {

    onChange(ITFStatus);

    const delay = (ms) => new Promise((resolve, reject) => {
      ITFStatus = ITFStatuses.active;
      onChange({ ITFStatus });

      // TODO: if the backend handles resubmission, this check can be removed
      if (ITFStatus === ITFStatuses.active) {
        setTimeout(resolve, ms);
      } else {
        const errorMessage = 'Network request failed';
        onChange({
          ITFStatus,
          errorMessage
        });
        reject(errorMessage);
      }
    });

    return delay(2000);
  };
}

//   apiRequest(
//     `${intentToFileUrl}`,
//     null,
//     ({ data }) => {
//       const ITFStatus = data.attributes.ITFStatus
//       onChange({ ITFStatus });
//       return ITFStatus === 'active';
//     },
//     ({ errors }) => {
//       const errorMessage = 'Network request failed';
//       onChange({
//         ITFStatus,
//         errorMessage
//       });
//       Raven.captureMessage(`vets_itf_error: ${errorMessage}`);
//     }
//   );
// };
// }
/* eslint-enable */

export function getAddressCountries() {
  return (dispatch) => {
    return apiRequest(
      '/v0/address/countries',
      null,
      (response) => {
        const countryList = response.countries.data.attributes.countries;
        // Log error if the countries response is not what we expect
        if (!Array.isArray(countryList) || countryList.length === 0) {
          Raven.captureMessage(`vets_pciu_unexpected_country_response: ${countryList}`);
        }
        dispatch({
          type: GET_ADDRESS_COUNTRIES_SUCCESS,
          countries: countryList,
          countriesAvailable: true
        });
        return recordEvent({ event: 'pciu-get-address-countries-success' });
      },
      (response) => {
        dispatch({ type: GET_ADDRESS_COUNTRIES_FAILURE });
        const status = getStatus(response);
        recordEvent({ event: 'pciu-get-address-countries-failure' });
        return Raven.captureException(new Error(`vets_pciu_error_getAddressCountries: ${status}`));
      }
    );
  };
}

export function getAddressStates() {
  return (dispatch) => {
    return apiRequest(
      '/v0/address/states',
      null,
      (response) => {
        let stateList = response.states.data.attributes.states;
        // Log error if the states response is not what we expect
        if (!Array.isArray(stateList) || stateList.length === 0) {
          Raven.captureMessage(`vets_letters_unexpected_state_response: ${stateList}`);
        }
        stateList = mergeAndLabelStateCodes(response.states.data.attributes.states);
        dispatch({
          type: GET_ADDRESS_STATES_SUCCESS,
          states: stateList,
          statesAvailable: true
        });
        return recordEvent({ event: 'pciu-get-address-states-success' });
      },
      (response) => {
        const status = getStatus(response);
        recordEvent({ event: 'pciu-get-address-states-failure' });
        Raven.captureException(new Error(`vets_pciu_error_getAddressStates: ${status}`));
        return dispatch({ type: GET_ADDRESS_STATES_FAILURE });
      }
    );
  };
}

