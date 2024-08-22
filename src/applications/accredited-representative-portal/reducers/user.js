import { combineReducers } from 'redux';

import { REMOVING_SAVED_FORM_SUCCESS } from 'platform/user/profile/actions';
import { LOG_OUT } from 'platform/user/authentication/actions';
import {
  FETCH_USER,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS,
} from '../actions/user';

function getNullProfileState() {
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
  const { account, profile } = payload;

  return {
    accountUuid: account.accountUuid,
    firstName: profile.firstName,
    lastName: profile.lastName,
    verified: profile.verified,
    prefillsAvailable: payload.prefillsAvailable,
    savedForms: payload.inProgressForms,
  };
}

function profileReducer(state = getNullProfileState(), action) {
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
    case LOG_OUT:
    case FETCH_USER_FAILURE:
      return {
        ...state,
        /**
         * For now, conservatively consider not just `401` but indeed any
         * momentary inability to retrieve an authenticated user as undeserving
         * of access to the portions of the app that require authentication.
         */
        ...getNullProfileState(),
        loading: false,
      };
    case REMOVING_SAVED_FORM_SUCCESS: {
      const savedForms = state.savedForms.filter(el => {
        return el.form !== action.formId;
      });
      return {
        ...state,
        savedForms,
      };
    }
    default:
      return state;
  }
}

function getNullLoginState() {
  return {
    currentlyLoggedIn: false,
  };
}

function loginReducer(state = getNullLoginState(), action) {
  switch (action.type) {
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        currentlyLoggedIn: true,
      };
    case LOG_OUT:
    case FETCH_USER_FAILURE:
      return {
        ...state,
        /**
         * For now, conservatively consider not just `401` but indeed any
         * momentary inability to retrieve an authenticated user as undeserving
         * of access to the portions of the app that require authentication.
         */
        ...getNullLoginState(),
      };
    default:
      return state;
  }
}

const userReducer = combineReducers({
  profile: profileReducer,
  login: loginReducer,
});

export default userReducer;
