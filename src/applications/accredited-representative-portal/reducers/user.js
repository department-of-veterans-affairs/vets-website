import { combineReducers } from 'redux';

import {
  FETCH_USER,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS,
} from '../actions/user';

function getInitialProfileState() {
  return {
    accountUuid: null,
    firstName: null,
    lastName: null,
    verified: false,
    prefillsAvailable: [],
    savedForms: [],
    loading: true,
  };
}

function transformProfilePayload(payload) {
  return payload;
}

function profileReducer(state = getInitialProfileState(), action) {
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        ...transformProfilePayload(action.payload),
        loading: false,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        /**
         * For now, conservatively consider not just `401` but indeed any
         * momentary inability to retrieve an authenticated user as undeserving
         * of access to the portions of the app that require authentication.
         */
        ...getInitialProfileState(),
        loading: false,
      };
    default:
      return state;
  }
}

function getInitialLoginState() {
  return {
    currentlyLoggedIn: false,
  };
}

function loginReducer(state = getInitialLoginState(), action) {
  switch (action.type) {
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        currentlyLoggedIn: true,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        /**
         * For now, conservatively consider not just `401` but indeed any
         * momentary inability to retrieve an authenticated user as undeserving
         * of access to the portions of the app that require authentication.
         */
        currentlyLoggedIn: false,
      };
    default:
      return state;
  }
}

export default combineReducers({
  profile: profileReducer,
  login: loginReducer,
});
