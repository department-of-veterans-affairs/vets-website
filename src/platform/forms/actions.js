import Raven from 'raven-js';

import recordEvent from '../monitoring/record-event';
import { apiRequest, getStatus } from '../../js/letters/utils/helpers.jsx';

import {
  GET_ADDRESS_COUNTRIES_FAILURE,
  GET_ADDRESS_COUNTRIES_SUCCESS,
  GET_ADDRESS_STATES_FAILURE,
  GET_ADDRESS_STATES_SUCCESS,
} from '../../js/letters/utils/constants';


export function getAddressCountries(onChange) {
  return (dispatch) => {
    return apiRequest(
      '/v0/address/countries',
      null,
      (response) => {
        dispatch({ type: GET_ADDRESS_COUNTRIES_SUCCESS });
        recordEvent({ event: 'pciu-get-address-countries-success' });
        const countryList = response.countries.data.attributes.countries;
        // Log error if the countries response is not what we expect
        if (!Array.isArray(countryList) || countryList.length === 0) {
          return Raven.captureMessage(`vets_pciu_unexpected_country_response: ${countryList}`);
        }
        return onChange(countryList);
      },
      (response) => {
        dispatch({ type: GET_ADDRESS_COUNTRIES_FAILURE });
        const status = getStatus(response);
        recordEvent({ event: 'pciu-get-address-countries-failure' });
        Raven.captureException(new Error(`vets_pciu_error_getAddressCountries: ${status}`));
      }
    );
  };
}

export function getAddressStates(onChange) {
  return (dispatch) => {
    return apiRequest(
      '/v0/address/states',
      null,
      (response) => {
        dispatch({
          type: GET_ADDRESS_STATES_SUCCESS
        });
        recordEvent({ event: 'pciu-get-address-states-success' });
        const stateList = response.states.data.attributes.states;
      // Log error if the states response is not what we expect
      if (!Array.isArray(stateList) || stateList.length === 0) {
        return Raven.captureMessage(`vets_letters_unexpected_state_response: ${stateList}`);
      }
        return onChange(stateList);
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

