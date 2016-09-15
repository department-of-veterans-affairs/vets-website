import { SEARCH_QUERY_UPDATED } from '../actions';
// TODO (bshyong): flesh out shape of service Type object/options
const INITIAL_STATE = { queryString: '', serviceType: null };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SEARCH_QUERY_UPDATED:
      return {
        ...state,
        ...action.payload.query,
      };
    default:
      return state;
  }
}
