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

const MAX_POLL_TIMES = 10;

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
      errors: null,
      loading: false,
      polling: false,
      polledTimes: 0,
      state: 'unknown'
    },
    terms: {
      accepted: false,
      errors: null,
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

    case ACCEPTING_LATEST_MHV_TERMS:
    case FETCHING_LATEST_MHV_TERMS:
    case ACCEPTING_LATEST_MHV_TERMS_SUCCESS:
      return set('mhv.terms', {
        ...state.mhv.terms,
        errors: null,
        loading: false,
      }, state);

    case FETCHING_LATEST_MHV_TERMS_SUCCESS: {
      return set('mhv.terms', {
        ...state.mhv.terms,
        ...action.terms,
        loading: false,
      }, state);
    }

    case ACCEPTING_LATEST_MHV_TERMS_FAILURE:
    case FETCHING_LATEST_MHV_TERMS_FAILURE:
      return set('mhv.terms', {
        ...state.mhv.terms,
        errors: action.errors,
        loading: false,
      }, state);

    case FETCHING_MHV_ACCOUNT:
    case CREATING_MHV_ACCOUNT:
      return set('mhv.account', {
        ...state.mhv.account,
        errors: null,
        loading: true
      }, state);

    case FETCH_MHV_ACCOUNT_FAILURE:
    case CREATE_MHV_ACCOUNT_FAILURE:
      return set('mhv.account', {
        ...state.mhv.account,
        errors: action.errors,
        loading: false
      }, state);

    case FETCH_MHV_ACCOUNT_SUCCESS: {
      const { accountState } = action.data.attributes;
      const { polling, polledTimes } = state.mhv.account;
      const shouldPoll =
        accountState !== 'upgraded' &&
        polling &&
        polledTimes < MAX_POLL_TIMES;

      return set('mhv.account', {
        errors: null,
        loading: false,
        polling: shouldPoll,
        polledTimes: shouldPoll ? polledTimes + 1 : 0,
        state: accountState
      }, state);
    }

    case CREATE_MHV_ACCOUNT_SUCCESS:
      return set('mhv.account', {
        ...state.mhv.account,
        errors: null,
        loading: false,
        polling: true,
        polledTimes: 0
      }, state);

    default:
      return state;
  }
}

export default profileInformation;
