import * as ACTIONS from '../actions';

export default function queryReducer(state = '', action) {
  switch (action.type) {
    case ACTIONS.QUERY_CHANGED:
      return action.query;
    default:
      return state;
  }
}
