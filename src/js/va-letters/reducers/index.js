import _ from 'lodash/fp';
import { combineReducers } from 'redux';

import { UPDATE_ADDRESS_CONFIRMATION } from '../actions/index';

const initialState = {
  isAddressConfirmed: null
};

function lettersStore(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ADDRESS_CONFIRMATION: {
      return _.set('isAddressConfirmed', action.value, state);
    }
    default: {
      return state;
    }
  }
}

export default {
  vaLetters: combineReducers({ lettersStore })
};
