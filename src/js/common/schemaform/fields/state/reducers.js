import Raven from 'raven-js';

import _ from 'lodash/fp';
import {
  GET_ADDRESS_COUNTRIES_SUCCESS,
  GET_ADDRESS_COUNTRIES_FAILURE,
  GET_ADDRESS_STATES_SUCCESS,
  GET_ADDRESS_STATES_FAILURE,
} from '../utils/constants';

export const initialState = {
  countries: [],
  countriesAvailable: false,
  states: [],
  statesAvailable: false
};

function pciu(state = initialState, action) {
  switch (action.type) {
    case GET_ADDRESS_COUNTRIES_SUCCESS: {
      let countriesAvailable = true;
      const countryList = action.countries.data.attributes.countries;

      // Log error if the countries response is not what we expect
      if (!Array.isArray(countryList) || countryList.length === 0) {
        Raven.captureMessage(`vets_pciu_unexpected_country_response: ${countryList}`);
        countriesAvailable = false;
      }

      return {
        ...state,
        countries: countryList,
        countriesAvailable
      };
    }
    case GET_ADDRESS_COUNTRIES_FAILURE:
      return _.set('countriesAvailable', false, state);
    case GET_ADDRESS_STATES_SUCCESS: {
      let statesAvailable = true;
      const stateList = action.states.data.attributes.states;

      // Log error if the states response is not what we expect
      if (!Array.isArray(stateList) || stateList.length === 0) {
        Raven.captureMessage(`vets_pciu_unexpected_state_response: ${stateList}`);
        statesAvailable = false;
      }
      return {
        ...state,
        states: stateList,
        statesAvailable
      };
    }
    case GET_ADDRESS_STATES_FAILURE:
      return _.set('statesAvailable', false, state);
    default:
      return state;
  }
}

export default {
 pciu 
};
