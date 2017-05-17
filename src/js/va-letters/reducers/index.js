import _ from 'lodash/fp';

import { UPDATE_ADDRESS_CONFIRMATION } from '../actions/index';

const initialState = {
  addressConfirmed: null
};

export default function userReducer(state = initialState, action) {
  let newState = undefined;

  switch (action.type) {
    case UPDATE_ADDRESS_CONFIRMATION: {
      newState = Object.assign({}, state);
      _.set('addressConfirmed', action.value, newState);
      return newState;
    }
    default: {
      return state;
    }
  }
}
