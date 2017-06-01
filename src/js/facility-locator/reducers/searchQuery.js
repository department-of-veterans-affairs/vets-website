import { SEARCH_QUERY_UPDATED, SEARCH_STARTED, SEARCH_FAILED, FETCH_VA_FACILITIES, FETCH_VA_FACILITY } from '../actions';

const INITIAL_STATE = {
  searchString: '',
  serviceType: null,
  facilityType: null,
  position: {
    latitude: 38.8976763,
    longitude: -77.03653,
  },
  bounds: [
    -77.53653,
    38.3976763,
    -76.53653,
    39.3976763,
  ],
  context: 20004,
  inProgress: false,
  currentPage: 1,
  zoomLevel: 11,
  searchBoundsInProgress: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SEARCH_STARTED:
      return {
        ...state,
        ...action.payload,
        error: false,
        inProgress: true,
      };
    case FETCH_VA_FACILITIES:
      return {
        ...state,
        error: false,
        inProgress: false,
        searchBoundsInProgress: false,
      };
    case FETCH_VA_FACILITY:
      return {
        ...state,
        error: false,
        inProgress: false,
      };
    case SEARCH_FAILED:
      return {
        ...state,
        error: true,
        inProgress: false,
      };
    case SEARCH_QUERY_UPDATED:
      return {
        ...state,
        ...action.payload,
        error: false,
      };
    default:
      return state;
  }
}
