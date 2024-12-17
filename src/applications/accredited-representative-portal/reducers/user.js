import { combineReducers } from 'redux';

import {
  FETCH_USER,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS,
} from '../actions/user';

function getNullProfileState() {
  return {
    firstName: null,
    lastName: null,
    loading: false,
  };
}

function transformProfilePayload(payload) {
  return {
    firstName: payload.profile.firstName,
    lastName: payload.profile.lastName,
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
    case FETCH_USER_FAILURE:
      return {
        ...state,
        ...getNullProfileState(),
        loading: false,
      };
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
    case FETCH_USER_FAILURE:
      return {
        ...state,
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
