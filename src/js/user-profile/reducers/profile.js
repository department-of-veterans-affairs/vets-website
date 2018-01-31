import { merge, set } from 'lodash/fp';

import {
  UPDATE_PROFILE_FIELDS,
  PROFILE_LOADING_FINISHED,
  FETCHING_LATEST_MHV_TERMS,
  FETCHING_LATEST_MHV_TERMS_SUCCESS,
  FETCHING_LATEST_MHV_TERMS_FAILURE,
  ACCEPTING_LATEST_MHV_TERMS,
  ACCEPTING_LATEST_MHV_TERMS_SUCCESS,
  ACCEPTING_LATEST_MHV_TERMS_FAILURE,
  FETCHING_MHV_ACCOUNT,
  FETCH_MHV_ACCOUNT_FAILURE,
  FETCH_MHV_ACCOUNT_SUCCESS,
  CREATING_MHV_ACCOUNT,
  CREATE_MHV_ACCOUNT_FAILURE,
  CREATE_MHV_ACCOUNT_SUCCESS
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
  mhv: {
    account: {
      loading: false,
      state: 'unknown'
    },
    errors: null,
    terms: {
      accepted: false,
      loading: false
    }
  },
  savedForms: [],
  prefillsAvailable: [],
  loading: true
};

function profileInformation(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE_FIELDS:
      return merge(state, action.newState);

    case PROFILE_LOADING_FINISHED:
    case FETCH_LOGIN_URLS_FAILED:
    case UPDATE_LOGGEDIN_STATUS:
      return set('loading', false, state);

    case FETCHING_LATEST_MHV_TERMS:
      return set('mhv.terms.loading', true, state);

    case FETCHING_LATEST_MHV_TERMS_SUCCESS: {
      return set('mhv.terms', {
        ...initialState.mhv.terms,
        ...action.terms,
        loading: false,
      }, state);
    }

    case FETCHING_LATEST_MHV_TERMS_FAILURE: {
      return set('mhv.terms', {
        ...initialState.mhv.terms,
        loading: false,
      }, state);
    }

    case ACCEPTING_LATEST_MHV_TERMS:
      return set('mhv.terms.loading', true, state);

    case ACCEPTING_LATEST_MHV_TERMS_SUCCESS:
    case ACCEPTING_LATEST_MHV_TERMS_FAILURE:
      return set('mhv.terms.loading', false, state);

    case FETCHING_MHV_ACCOUNT:
    case CREATING_MHV_ACCOUNT: {
      const newState = set('mhv.account.loading', true, state);
      return set('mhv.errors', null, newState);
    }

    case FETCH_MHV_ACCOUNT_FAILURE:
    case CREATE_MHV_ACCOUNT_FAILURE: {
      const newState = set('mhv.account.loading', false, state);
      return set('mhv.errors', action.errors, newState);
    }

    case FETCH_MHV_ACCOUNT_SUCCESS:
      return set('mhv.account.state', action.data.attributes.accountState, state);

    case CREATE_MHV_ACCOUNT_SUCCESS:
      return set('mhv.account.loading', false, state);

    default:
      return state;
  }
}

export default profileInformation;
