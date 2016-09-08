import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { UPDATE_LOGGEDIN_STATUS, UPDATE_LOGIN_URL, LOG_OUT } from '../actions';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);


const initialState = {
  currentlyLoggedIn: false,
  loginUrl: '',
};

function loginStuff(state = initialState, action) {
  let newState = undefined;
  switch (action.type) {
    case UPDATE_LOGGEDIN_STATUS:
      newState = Object.assign({}, state);
      _.set(newState, 'currentlyLoggedIn', action.value);
      return newState;

    case UPDATE_LOGIN_URL:
      newState = Object.assign({}, state);
      _.set(newState, 'loginUrl', action.value);
      return newState;

    case LOG_OUT:
      newState = initialState;
      return newState;

    default:
      return state;
  }
}

export default loginStuff;
