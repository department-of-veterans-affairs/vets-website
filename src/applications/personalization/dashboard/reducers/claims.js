import { merge, set } from 'lodash';

import {
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_SUCCESS,
  FETCH_CLAIMS_ERROR,
  FETCH_STEM_CLAIMS_ERROR,
  FETCH_STEM_CLAIMS_PENDING,
  FETCH_STEM_CLAIMS_SUCCESS,
} from '../actions/claims';
import {
  FETCH_APPEALS_SUCCESS,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_ERROR,
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
} from '../actions/appeals';
import { appealsAvailability } from '../utils/appeals-helpers';
import { claimsAvailability, CHANGE_INDEX_PAGE } from '../utils/claims-helpers';

// NOTE: Pagination is controlled by reducers in ./claims-list.js

const initialState = {
  claims: [],
  appeals: [],
  stemClaims: [],
  claimsLoading: false,
  appealsLoading: false,
  stemClaimsLoading: false,
};

export default function claimsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CLAIMS_PENDING:
      return set(state, true, 'claimsLoading');
    case FETCH_CLAIMS_SUCCESS:
      return merge({}, state, {
        claims: action.claims,
        claimsLoading: false,
        claimsAvailability: claimsAvailability.AVAILABLE,
      });
    case FETCH_CLAIMS_ERROR:
      // TO-DO: Parse errors out
      return merge({}, state, {
        claimsLoading: false,
        claimsAvailability: claimsAvailability.UNAVAILABLE,
      });
    case FETCH_APPEALS_PENDING:
      return set(state, true, 'appealsLoading');
    case FETCH_APPEALS_SUCCESS:
      return merge({}, state, {
        appeals: action.appeals,
        appealsLoading: false,
        available: true,
        appealsAvailability: appealsAvailability.AVAILABLE,
      });
    case USER_FORBIDDEN_ERROR:
      return merge({}, state, {
        appealsLoading: false,
        appealsAvailability: appealsAvailability.USER_FORBIDDEN_ERROR,
      });
    case RECORD_NOT_FOUND_ERROR:
      return merge({}, state, {
        appealsLoading: false,
        appealsAvailability: appealsAvailability.RECORD_NOT_FOUND_ERROR,
      });
    case VALIDATION_ERROR:
      return merge({}, state, {
        appealsLoading: false,
        appealsAvailability: appealsAvailability.VALIDATION_ERROR,
      });
    case BACKEND_SERVICE_ERROR:
      return merge({}, state, {
        appealsLoading: false,
        appealsAvailability: appealsAvailability.BACKEND_SERVICE_ERROR,
      });
    case FETCH_APPEALS_ERROR:
      return merge({}, state, {
        appealsLoading: false,
        appealsAvailability: appealsAvailability.FETCH_APPEALS_ERROR,
      });

    case CHANGE_INDEX_PAGE:
      return set(state, true, 'page');

    case FETCH_STEM_CLAIMS_PENDING:
      return {
        ...state,
        stemClaimsLoading: true,
      };

    case FETCH_STEM_CLAIMS_ERROR:
      return {
        ...state,
        stemClaimsLoading: false,
      };

    case FETCH_STEM_CLAIMS_SUCCESS:
      return {
        ...state,
        stemClaimsLoading: false,
        stemClaims: action.stemClaims,
      };
    default:
      return state;
  }
}
