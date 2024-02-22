import {
  SEARCH_STARTED,
  SEARCH_FAILED,
  SEARCH_COMPLETE,
  SEARCH_QUERY_UPDATED,
  FETCH_REPRESENTATIVES,
  GEOCODE_STARTED,
  GEOCODE_FAILED,
  GEOCODE_COMPLETE,
  // CLEAR_GEOCODE_ERROR,
  CLEAR_SEARCH_TEXT,
  GEOLOCATE_USER,
} from '../utils/actionTypes';

export const INITIAL_STATE = {
  locationInputString: '',
  representativeInputString: '',
  locationQueryString: '',
  representativeQueryString: '',
  representativeType: 'veteran_service_officer',
  sortType: 'distance_asc',
  searchArea: '50',
  position: {
    latitude: 40.17887331434698,
    longitude: -99.27246093750001,
  },
  currentPage: 1,
  inProgress: false,
  searchWithInputInProgress: false,
  geocodeInProgress: false,
  geocodeResults: [],
  isErrorEmptyInput: false,
  mapMoved: false,
  error: false,
  isValid: true,
  searchCounter: 0,
};

export const validateForm = (oldState, payload) => {
  const newState = {
    ...oldState,
    ...payload,
  };

  return {
    isValid: newState.locationInputString?.length > 0,
    isErrorEmptyInput: newState.locationInputString?.length === 0,
    locationChanged:
      oldState.locationInputString !== newState.locationInputString,
    representativeChanged:
      oldState.representativeInputString !== newState.representativeInputString,
    representativeTypeChanged:
      oldState.representativeType !== newState.representativeType,
  };
};

export const SearchQueryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_STARTED:
      return {
        ...state,
        ...action.payload,
        inProgress: true,
      };
    case SEARCH_COMPLETE:
      return {
        ...state,
        ...action.payload,
        inProgress: false,
        searchCounter: state.searchCounter + 1,
      };
    case FETCH_REPRESENTATIVES:
      return {
        ...state,
        ...action.payload,
        inProgress: false,
        searchWithInputInProgress: false,
        ...validateForm(state, action.payload),
      };
    case SEARCH_FAILED:
      return {
        ...state,
        inProgress: false,
        searchCounter: state.searchCounter + 1,
        searchWithInputInProgress: false,
      };
    case SEARCH_QUERY_UPDATED:
      return {
        ...state,
        ...action.payload,
      };
    case GEOCODE_STARTED:
      return {
        ...state,
        geocodeInProgress: true,
      };
    case GEOLOCATE_USER:
      return {
        ...state,
        geolocationInProgress: true,
      };
    case GEOCODE_FAILED:
      return {
        ...state,
        geocodeInProgress: false,
        geolocationInProgress: false,
      };
    case GEOCODE_COMPLETE:
      return {
        ...state,
        geocodeResults: action.payload,
        geocodeInProgress: false,
        geolocationInProgress: false,
      };
    case CLEAR_SEARCH_TEXT:
      return {
        ...state,
        locationInputString: '',
        isValid: false,
        locationChanged: true,
      };
    default:
      return state;
  }
};
