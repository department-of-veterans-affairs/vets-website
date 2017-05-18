import _ from 'lodash/fp';

import {
  UPDATE_PROFILE_FIELD,
  FETCHING_MHV_TERMS_ACCEPTANCE,
  FETCHING_MHV_TERMS_ACCEPTANCE_SUCCESS,
  FETCHING_MHV_TERMS_ACCEPTANCE_FAILURE,
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

    default:
      return state;
  }
}

export default profileInformation;
