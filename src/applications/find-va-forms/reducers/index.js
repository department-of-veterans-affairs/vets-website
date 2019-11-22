import { combineReducers } from 'redux';

import * as ACTIONS from '../actions';

function searchResultsReducer(state = null, _action) {
  return state;
}

function queryReducer(state = '', action) {
  switch (action.type) {
    case ACTIONS.QUERY_CHANGED:
      return action.query;
    default:
      return state;
  }
}

export default {
  findVaForms: combineReducers({
    query: queryReducer,
    searchResults: searchResultsReducer,
  }),
};
