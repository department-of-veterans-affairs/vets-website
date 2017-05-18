import _ from 'lodash';

import { UPDATE_ADDRESS_CONFIRMATION } from '../actions/index';

const initialState = {
  addressConfirmed: null
};

export default function userReducer(state = initialState, action) {
  let newState = undefined;

  switch (action.type) {
    case UPDATE_ADDRESS_CONFIRMATION: {
      newState = Object.assign({}, state);
      _.set(newState, 'addressConfirmed', action.value);
      return newState;
    }
    default: {
      return state;
    }
  }
}
