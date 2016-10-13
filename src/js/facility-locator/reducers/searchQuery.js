import { SEARCH_QUERY_UPDATED, SEARCH_STARTED } from '../actions';
// TODO (bshyong): flesh out shape of service Type object/options
const INITIAL_STATE = {
  searchString: '',
  serviceType: 'all',
  facilityType: 'all',
  position: {
    latitude: 38.8976763,
    longitude: -77.03653,
  },
  context: 20500,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SEARCH_STARTED:
      return {
        ...state,
        ...action.payload,
      };
    case SEARCH_QUERY_UPDATED:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
