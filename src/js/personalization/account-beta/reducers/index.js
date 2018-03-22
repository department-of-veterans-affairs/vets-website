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
import { UPDATE_LOGGEDIN_STATUS, FETCH_LOGIN_URLS_FAILED } from '../../../login/actions';

// TODO(crew): Romove before this goes to production.
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
    loading: false,
    terms: {},
  },
  savedForms: [],
  prefillsAvailable: [],
  loading: true
};

function account(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE_FIELDS:
      return { ...state, ...action.newState };

    case FETCH_LOGIN_URLS_FAILED:
    case PROFILE_LOADING_FINISHED:
    case UPDATE_LOGGEDIN_STATUS:
      return { ...state, loading: false };

    case FETCHING_LATEST_MHV_TERMS: {
      return {
        ...state,
        terms: {
          ...state.terms,
          content: {},
          loading: true,
        }
      };
    }

    case FETCHING_LATEST_MHV_TERMS_SUCCESS: {
      return {
        ...state,
        terms: {
          ...state.terms,
          ...action.terms,
          loading: false,
        }
      };
    }

    case FETCHING_LATEST_MHV_TERMS_FAILURE: {
      return {
        ...state,
        terms: {
          loading: false,
        }
      };
    }

    case ACCEPTING_LATEST_MHV_TERMS: {
      return state;
    }

    case ACCEPTING_LATEST_MHV_TERMS_SUCCESS: {
      return {
        ...state,
        terms: {
          loading: false,
        }
      };
    }

    case ACCEPTING_LATEST_MHV_TERMS_FAILURE: {
      return {
        ...state,
        terms: {
          ...state.terms,
          loading: false,
        }
      };
    }

    default:
      return state;
  }
}

// @todo Once this leaves beta, we'll have to decide if things should (confusedly) become "profile",
// since that is what the rest of the applications have known these properties as, even though from
// this point forward these attributes will be known as "account" information since it mostly comes
// from the IDP.
export default { account };
