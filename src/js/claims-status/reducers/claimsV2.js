import _ from 'lodash/fp';
import {
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_SUCCESS,
  FETCH_CLAIMS_ERROR,
  claimsAvailability,
  CHANGE_INDEX_PAGE
} from '../utils/appeals-v2-helpers';

// NOTE: Pagination is controlled by reducers in ./claims-list.js

const initialState = {
  claims: [],
  claimsLoading: false,
  page: 1,
  pages: 1
};

export default function claimsV2Reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CLAIMS_PENDING:
      return _.set('claimsLoading', true, state);
    case FETCH_CLAIMS_SUCCESS:
      return _.merge(state, {
        claims: action.claims,
        claimsLoading: false,
        pages: action.pages,
        claimsAvailability: claimsAvailability.AVAILABLE
      });
    case FETCH_CLAIMS_ERROR:
      // TO-DO: Parse errors out
      return _.merge(state, {
        claimsLoading: false,
        claimsAvailability: claimsAvailability.UNAVAILABLE
      });
    case CHANGE_INDEX_PAGE:
      return _.set('page', action.page, state);
    default:
      return state;
  }
}
