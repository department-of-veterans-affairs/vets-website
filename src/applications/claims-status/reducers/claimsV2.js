import set from 'platform/utilities/data/set';
import merge from 'lodash/merge';
import {
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_SUCCESS,
  FETCH_CLAIMS_ERROR,
  FETCH_APPEALS_SUCCESS,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_ERROR,
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
  claimsAvailability,
  appealsAvailability,
  CHANGE_INDEX_PAGE,
} from '../utils/appeals-v2-helpers';

// NOTE: Pagination is controlled by reducers in ./claims-list.js

const initialState = {
  claims: [],
  appeals: [],
  claimsLoading: false,
  appealsLoading: false,
  page: 1,
  pages: 1,
};

export default function claimsV2Reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CLAIMS_PENDING:
      return set('claimsLoading', true, state);
    case FETCH_CLAIMS_SUCCESS:
      return merge(
        {
          claims: action.claims,
          claimsLoading: false,
          pages: action.pages,
          claimsAvailability: claimsAvailability.AVAILABLE,
        },
        state,
      );
    case FETCH_CLAIMS_ERROR:
      // TO-DO: Parse errors out
      return merge(
        {
          claimsLoading: false,
          claimsAvailability: claimsAvailability.UNAVAILABLE,
        },
        state,
      );
    case FETCH_APPEALS_PENDING:
      return set('appealsLoading', true, state);
    case FETCH_APPEALS_SUCCESS:
      return merge(
        {
          appeals: action.appeals,
          appealsLoading: false,
          available: true,
          v2Availability: appealsAvailability.AVAILABLE,
        },
        state,
      );
    case USER_FORBIDDEN_ERROR:
      return merge(
        {
          appealsLoading: false,
          v2Availability: appealsAvailability.USER_FORBIDDEN_ERROR,
        },
        state,
      );
    case RECORD_NOT_FOUND_ERROR:
      return merge(
        {
          appealsLoading: false,
          v2Availability: appealsAvailability.RECORD_NOT_FOUND_ERROR,
        },
        state,
      );
    case VALIDATION_ERROR:
      return merge(
        {
          appealsLoading: false,
          v2Availability: appealsAvailability.VALIDATION_ERROR,
        },
        state,
      );
    case BACKEND_SERVICE_ERROR:
      return merge(
        {
          appealsLoading: false,
          v2Availability: appealsAvailability.BACKEND_SERVICE_ERROR,
        },
        state,
      );
    case FETCH_APPEALS_ERROR:
      return merge(
        {
          appealsLoading: false,
          v2Availability: appealsAvailability.FETCH_APPEALS_ERROR,
        },
        state,
      );

    case CHANGE_INDEX_PAGE:
      return set('page', action.page, state);
    default:
      return state;
  }
}
