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

// Sort by the date of the last event
function sortAppeals(list) {
}

export default function appealsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_APPEALS_PENDING:
      return _.set('appealsLoading', true, state);
    case FETCH_APPEALS_SUCCESS: {
      const list = sortAppeals(action.appeals);

      return _.merge(state, {
        appealsLoading: false,
        available: true,
        appealsList: list
      });
    }
    // TODO: Verify that this isn't actually needed and then remove it
    case SET_APPEALS:
      return _.set('available', true, state);
    case SET_APPEALS_UNAVAILABLE:
      // Maybe should set appealsLoading to false here too
      return _.set('available', false, state);
    default:
      return state;
  }
}
