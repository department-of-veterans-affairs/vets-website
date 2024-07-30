import { combineReducers } from 'redux';
import {
  FETCH_USER,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS,
} from '../actions/user';

const initialState = {
  profile: {
    userFullName: {
      first: null,
      last: null,
    },
    savedForms: [],
    prefillsAvailable: [],
    accountUuid: null,
    verified: false,
    loading: true,
    errors: false,
  },
  login: {
    currentlyLoggedIn: false,
  },
};

function transformProfilePayload(payload) {
  // TODO: implement
  return payload;
}

// TODO: Figure out what data to indicate logged out.
function profileReducer(state = initialState, action) {
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
    default:
      return state;
  }
}

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        currentlyLoggedIn: true,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        // Conservatively consider more than just `401` but indeed anything that
        // indicates even a momentary inability to retrieve an authenticated
        // user as undeserving of access to the portions of the app that require
        // authentication.
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
