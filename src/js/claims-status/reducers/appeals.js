import _ from 'lodash/fp';

import {
  SET_APPEALS,
  SET_APPEALS_UNAVAILABLE,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS,
} from '../actions/index.jsx';

import {
  USER_FORBIDDEN,
  RECORD_NOT_FOUND,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
  APPEALS_FETCH_ERROR
} from '../utils/appeals-v2-helpers';

const initialState = {
  available: true,
  availabilityError: null,
};

// export default function appealsReducer(state = initialState, action) {
//   switch (action.type) {
//     case FETCH_APPEALS_PENDING:
//       return _.set('appealsLoading', true, state);
//     case FETCH_APPEALS_SUCCESS:
//       return _.merge(state, {
//         appealsLoading: false,
//         available: true,
//       });
//     case SET_APPEALS:
//       return _.set('available', true, state);
//     case SET_APPEALS_UNAVAILABLE:
//       // Maybe should set appealsLoading to false here too
//       return _.set('available', false, state);
//     default:
//       return state;
//   }
// }

export default function appealsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_APPEALS_PENDING:
      return _.set('appealsLoading', true, state);
    case FETCH_APPEALS_SUCCESS: // Appeals v1 and v2
      // appeals are added to Redux store via FETCH_APPEALS_SUCCESS
      // reducer in claims-list.js
      return _.merge(state, {
        appealsLoading: false,
        available: true,
      });
    case SET_APPEALS: // Appeals v1
      return _.set('available', true, state);
    case SET_APPEALS_UNAVAILABLE: // Appeals v1
      return _.set('available', false, state);
    // Following are reducers for Appeals v2 error states  
    case USER_FORBIDDEN:
      return _.merge(state, {
        appealsLoading: false,
        available: false,
        availabilityError: USER_FORBIDDEN,
      });
    case RECORD_NOT_FOUND:
      return _.merge(state, {
        appealsLoading: false,
        available: false,
        availabilityError: RECORD_NOT_FOUND,
      });
    case VALIDATION_ERROR:
      return _.merge(state, {
        appealsLoading: false,
        available: false,
        availabilityError: VALIDATION_ERROR,
      });
    case BACKEND_SERVICE_ERROR:
      return _.merge(state, {
        appealsLoading: false,
        available: false,
        availabilityError: BACKEND_SERVICE_ERROR,
      });
    case APPEALS_FETCH_ERROR:
      return _.merge(state, {
        appealsLoading: false,
        available: false,
        availabilityError: APPEALS_FETCH_ERROR,
      });
    default:
      return state;
  }
}
