import _ from 'lodash/fp';

import {
  UPDATE_PROFILE_FIELD,
  FETCHING_MHV_TERMS_ACCEPTANCE,
  FETCHING_MHV_TERMS_ACCEPTANCE_SUCCESS,
  FETCHING_MHV_TERMS_ACCEPTANCE_FAILURE,
  FETCHING_LATEST_MHV_TERMS,
  FETCHING_LATEST_MHV_TERMS_SUCCESS,
  FETCHING_LATEST_MHV_TERMS_FAILURE,
  ACCEPTING_LATEST_MHV_TERMS,
  ACCEPTING_LATEST_MHV_TERMS_SUCCESS,
  ACCEPTING_LATEST_MHV_TERMS_FAILURE,
 } from '../actions';

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
    acceptance: false,
    terms: {},
  }
};

function profileInformation(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE_FIELD: {
      return _.set(action.propertyPath, action.value, state);
    }
    case FETCHING_MHV_TERMS_ACCEPTANCE: {
      return {
        ...state,
        terms: {
          loading: true,
        }
      };
    }
    case FETCHING_MHV_TERMS_ACCEPTANCE_SUCCESS: {
      return {
        ...state,
        terms: {
          loading: false,
          acceptance: action.acceptance,
        }
      };
    }
    case FETCHING_MHV_TERMS_ACCEPTANCE_FAILURE: {
      return {
        ...state,
        terms: {
          loading: false,
        }
      };
    }
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
          acceptance: true,
          loading: false,
        }
      };
    }
    case ACCEPTING_LATEST_MHV_TERMS_FAILURE: {
      return {
        ...state,
        terms: {
          loading: false,
        }
      };
    }

    default:
      return state;
  }
}

export default profileInformation;
