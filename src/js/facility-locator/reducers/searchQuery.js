import { SEARCH_QUERY_UPDATED, SEARCH_STARTED, SEARCH_SUCCEEDED, SEARCH_FAILED } from '../actions';
// TODO (bshyong): flesh out shape of service Type object/options
const INITIAL_STATE = {
  searchString: '',
  serviceType: null,
  facilityType: null,
  position: {
    latitude: 38.8976763,
    longitude: -77.03653,
  },
  bounds: null,
  context: 20500,
  inProgress: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SEARCH_STARTED:
      return {
        ...state,
        ...action.payload,
        inProgress: true,
      };
    case SEARCH_SUCCEEDED:
      return {
        ...state,
        ...action.payload,
        inProgress: false,
      };
    case SEARCH_FAILED:
      return {
        ...state,
        ...action.payload,
        inProgress: false,
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
