import { assign, set } from 'lodash/fp';

import {
  UPDATE_PROFILE_FIELDS,
  PROFILE_LOADING_FINISHED,
  FETCHING_LATEST_MHV_TERMS,
  FETCHING_LATEST_MHV_TERMS_SUCCESS,
  FETCHING_LATEST_MHV_TERMS_FAILURE,
  ACCEPTING_LATEST_MHV_TERMS,
  ACCEPTING_LATEST_MHV_TERMS_SUCCESS,
  ACCEPTING_LATEST_MHV_TERMS_FAILURE,
} from '../actions';
import { UPDATE_LOGGEDIN_STATUS, FETCH_LOGIN_URLS_FAILED } from '../../login/actions';

const initialState = {
  userFullName: {
    first: null,
    middle: null,
    last: null,
    suffix: null,
  },
  email: null,
  dob: null,
  gender: null,
  accountType: null,
  terms: {
    loading: false
  },
  savedForms: [],
  prefillsAvailable: [],
  loading: true
};

function profileInformation(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE_FIELDS:
      return assign(state, action.newState);

    case PROFILE_LOADING_FINISHED:
    case FETCH_LOGIN_URLS_FAILED:
    case UPDATE_LOGGEDIN_STATUS:
      return set('loading', false, state);

    case FETCHING_LATEST_MHV_TERMS:
      return set('terms.loading', true, state);

    case FETCHING_LATEST_MHV_TERMS_SUCCESS: {
      return set('terms', {
        ...initialState.terms,
        ...action.terms,
        loading: false,
      }, state);
    }

    case FETCHING_LATEST_MHV_TERMS_FAILURE: {
      return set('terms', {
        ...initialState.terms,
        loading: false,
      }, state);
    }

    case ACCEPTING_LATEST_MHV_TERMS: {
      return set('terms.loading', true, state);
    }

    case ACCEPTING_LATEST_MHV_TERMS_SUCCESS:
    case ACCEPTING_LATEST_MHV_TERMS_FAILURE: {
      return set('terms.loading', false, state);
    }

    default:
      return state;
  }
}

export default profileInformation;
