import _ from 'lodash/fp';

import {
  SET_APPEALS,
  SET_APPEALS_UNAVAILABLE,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS
} from '../actions/index.jsx';

const initialState = {
  available: true,
};

export default function appealsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_APPEALS_PENDING:
      return _.set('appealsLoading', true, state);
    case FETCH_APPEALS_SUCCESS:
      return _.merge(state, {
        appealsLoading: false,
        available: true,
      });
    case SET_APPEALS:
      return _.set('available', true, state);
    case SET_APPEALS_UNAVAILABLE:
      // Maybe should set appealsLoading to false here too
      return _.set('available', false, state);
    default:
      return state;
  }
}
