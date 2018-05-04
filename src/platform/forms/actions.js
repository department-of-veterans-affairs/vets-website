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
        recordEvent({ event: 'pciu-get-address-countries-success' });
        onChange(response);
        return dispatch({
          type: GET_ADDRESS_COUNTRIES_SUCCESS,
        });
      },
      (response) => {
        const status = getStatus(response);
        recordEvent({ event: 'pciu-get-address-countries-failure' });
        Raven.captureException(new Error(`vets_pciu_error_getAddressCountries: ${status}`));
        return dispatch({ type: GET_ADDRESS_COUNTRIES_FAILURE });
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
        recordEvent({ event: 'pciu-get-address-states-success' });
        // TODO: check if contains military states codes
        // if so record event to remove merge
        // and don't merge
        // if not
        // onChange merge
        onChange(response);
        return dispatch({
          type: GET_ADDRESS_STATES_SUCCESS
        });
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

