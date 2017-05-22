import _ from 'lodash/fp';

import { UPDATE_ADDRESS_CONFIRMATION } from '../actions/index';

const initialState = {
  addressConfirmed: null
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ADDRESS_CONFIRMATION: {
      return _.set('addressConfirmed', action.value, state);
    }
    default: {
      return state;
    }
  }
}
