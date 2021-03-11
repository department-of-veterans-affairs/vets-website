import {
  SEARCH_STARTED,
  SEARCH_FAILED,
  SEARCH_COMPLETE,
  SEARCH_QUERY_UPDATED,
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  FETCH_SPECIALTIES,
  FETCH_SPECIALTIES_DONE,
  FETCH_SPECIALTIES_FAILED,
  GEOCODE_STARTED,
  GEOCODE_FAILED,
  GEOCODE_COMPLETE,
  GEOCODE_CLEAR_ERROR,
  MAP_MOVED,
  CLEAR_SEARCH_TEXT,
} from '../utils/actionTypes';

export const INITIAL_STATE = {
  searchString: '',
  serviceType: null,
  facilityType: null,
  position: {
    latitude: 40.17887331434698,
    longitude: -99.27246093750001,
  },
  bounds: [-77.53653, 38.3976763, -76.53653, 39.3976763],
  context: '20004',
  currentPage: 1,
  zoomLevel: 4,
  inProgress: false,
  searchBoundsInProgress: false,
  fetchSvcsInProgress: false,
  geocodeInProgress: false,
  geocodeResults: [],
  mapMoved: false,
  isValid: true,
};

const validateForm = state => {
  const needServiceType = state.facilityType === 'provider';

  return (
    state.searchString?.length > 0 &&
    state.facilityType?.length > 0 &&
    (needServiceType ? state.serviceType?.length > 0 : true)
  );
};

export const SearchQueryReducer = (state = INITIAL_STATE, action) => {
  let newState = {};

  switch (action.type) {
    case SEARCH_STARTED:
      return {
        ...state,
        ...action.payload,
        error: false,
        inProgress: true,
        mapMoved: false,
      };
    case FETCH_LOCATIONS:
      return {
        ...state,
        error: false,
        inProgress: false,
        searchBoundsInProgress: false,
        mapMoved: false,
        isValid: validateForm(state),
      };
    case MAP_MOVED:
      return {
        ...state,
        mapMoved: true,
        isValid: validateForm(state),
      };
    case FETCH_LOCATION_DETAIL:
    case SEARCH_COMPLETE:
      return {
        ...state,
        error: false,
        isValid: validateForm(state),
        inProgress: false,
        mapMoved: false,
      };
    case FETCH_SPECIALTIES:
      return {
        ...state,
        error: false,
        fetchSvcsInProgress: true,
      };
    case FETCH_SPECIALTIES_DONE:
      return {
        ...state,
        error: false,
        fetchSvcsInProgress: false,
        specialties: action.data
          ? action.data.reduce((acc, cur) => {
              acc[cur.specialtyCode] = cur.name;
              return acc;
            }, {})
          : null,
      };
    case FETCH_SPECIALTIES_FAILED:
      return {
        ...state,
        error: true,
        fetchSvcsInProgress: false,
      };
    case SEARCH_FAILED:
      return {
        ...state,
        error: true,
        isValid: validateForm(state),
        inProgress: false,
        searchBoundsInProgress: false,
      };
    case SEARCH_QUERY_UPDATED:
      newState = {
        ...state,
        ...action.payload,
        error: false,
      };

      newState.isValid = validateForm(newState);

      return newState;
    case GEOCODE_STARTED:
      return {
        ...state,
        error: false,
        geocodeInProgress: true,
      };
    case GEOCODE_FAILED:
      return {
        ...state,
        error: true,
        geocodeError: action.code,
        geocodeInProgress: false,
      };
    case GEOCODE_COMPLETE:
      return {
        ...state,
        geocodeResults: action.payload,
        error: false,
        geocodeInProgress: false,
      };
    case GEOCODE_CLEAR_ERROR:
      return {
        ...state,
        error: false,
        geocodeError: 0,
        geocodeInProgress: false,
      };
    case CLEAR_SEARCH_TEXT:
      return {
        ...state,
        searchString: '',
        isValid: false,
      };
    default:
      return state;
  }
};
