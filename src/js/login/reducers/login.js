import _ from 'lodash/fp';

import { UPDATE_LOGGEDIN_STATUS, UPDATE_LOGIN_URL, LOG_OUT } from '../actions';

const initialState = {
  currentlyLoggedIn: false,
  loginUrl: {
    first: null,
    third: null
  },
};

function loginStuff(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOGGEDIN_STATUS:
      return _.set('currentlyLoggedIn', action.value, state);

    case UPDATE_LOGIN_URL:
      return _.set(`loginUrl.${action.propertyPath}`, action.value, state);

    case LOG_OUT:
      return _.set('currentlyLoggedIn', false, state);

    default:
      return state;
  }
}

export default loginStuff;
