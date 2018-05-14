import _ from 'lodash/fp';

import { pciuCountries, pciuStates } from './helpers';

import formConfig from './config/form';
import createSchemaFormReducer from '../../common/schemaform/state';

import {
  GET_ADDRESS_COUNTRIES_SUCCESS,
  GET_ADDRESS_COUNTRIES_FAILURE,
  GET_ADDRESS_STATES_SUCCESS,
  GET_ADDRESS_STATES_FAILURE,
} from '../../letters/utils/constants';

const initialState = {
  countries: pciuCountries,
  countriesAvailable: false,
  states: pciuStates,
  statesAvailable: false
};

export const pciu = (state = initialState, action) => {
  switch (action.type) {
    case GET_ADDRESS_COUNTRIES_SUCCESS: {
      return {
        ...state,
        ...action
      };
    }
    case GET_ADDRESS_COUNTRIES_FAILURE:
      return _.set('countriesAvailable', false, state);
    case GET_ADDRESS_STATES_SUCCESS: {
      return {
        ...state,
        ...action
      };
    }
    case GET_ADDRESS_STATES_FAILURE:
      return _.set('statesAvailable', false, state);
    default:
      return state;
  }
};

export default {
  form: createSchemaFormReducer(formConfig),
  pciu
};
