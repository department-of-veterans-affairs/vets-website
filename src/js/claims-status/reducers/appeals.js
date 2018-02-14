import _ from 'lodash/fp';

import {
  SET_APPEALS,
  SET_APPEALS_UNAVAILABLE,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS,
} from '../actions/index.jsx';

import {
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
  FETCH_APPEALS_ERROR,
  AVAILABLE
} from '../utils/appeals-v2-helpers';

const initialState = {
  available: true
};

// TO-DO: Break out v2 into its own reducer
export default function appealsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_APPEALS_PENDING: // pretty sure this is only in v2
      return _.set('appealsLoading', true, state);
    case FETCH_APPEALS_SUCCESS: // Appeals v1 and v2
      // appeals are added to Redux store via FETCH_APPEALS_SUCCESS
      // reducer in claims-list.js
      return _.merge(state, {
        appealsLoading: false,
        available: true,
        v2Availability: AVAILABLE // New and improved! More bits of info!
      });
    case SET_APPEALS: // Appeals v1
      return _.set('available', true, state);
    case SET_APPEALS_UNAVAILABLE: // Appeals v1
      return _.set('available', false, state);
    // Following are reducers for Appeals v2 error states  
    case USER_FORBIDDEN_ERROR:
      return _.merge(state, {
        appealsLoading: false,
        v2Availability: USER_FORBIDDEN_ERROR,
      });
    case RECORD_NOT_FOUND_ERROR:
      return _.merge(state, {
        appealsLoading: false,
        v2Availability: RECORD_NOT_FOUND_ERROR,
      });
    case VALIDATION_ERROR:
      return _.merge(state, {
        appealsLoading: false,
        v2Availability: VALIDATION_ERROR,
      });
    case BACKEND_SERVICE_ERROR:
      return _.merge(state, {
        appealsLoading: false,
        v2Availability: BACKEND_SERVICE_ERROR,
      });
    case FETCH_APPEALS_ERROR:
      return _.merge(state, {
        appealsLoading: false,
        v2Availability: FETCH_APPEALS_ERROR,
      });
    default:
      return state;
  }
}
