import {
  SEARCH_STARTED,
  SEARCH_FAILED,
  SEARCH_COMPLETE,
  SEARCH_QUERY_UPDATED,
  FETCH_REPRESENTATIVES,
  GEOCODE_STARTED,
  GEOCODE_FAILED,
  GEOCODE_COMPLETE,
  GEOCODE_CLEAR_ERROR,
  CLEAR_SEARCH_TEXT,
  GEOLOCATE_USER,
} from '../utils/actionTypes';

export const INITIAL_STATE = {
  locationInputString: '',
  repOfficerInputString: '',
  locationQueryString: '',
  repOfficerQueryString: '',
  representativeType: 'officer',
  sortType: 'distance_asc',
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
  isErrorCleared: true,
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
    repOfficerChanged:
      oldState.repOfficerInputString !== newState.repOfficerInputString,
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
        error: false,
        inProgress: true,
      };
    case SEARCH_COMPLETE:
      return {
        ...state,
        ...action.payload,
        error: false,
        inProgress: false,
        searchCounter: state.searchCounter + 1,
      };
    case FETCH_REPRESENTATIVES:
      return {
        ...state,
        ...action.payload,
        error: false,
        inProgress: false,
        searchWithInputInProgress: false,
        ...validateForm(state, action.payload),
      };
    case SEARCH_FAILED:
      return {
        ...state,
        error: true,
        inProgress: false,
        searchCounter: state.searchCounter + 1,
        searchWithInputInProgress: false,
      };
    case SEARCH_QUERY_UPDATED:
      return {
        ...state,
        ...action.payload,
        ...validateForm(state, action.payload),
        error: false,
      };
    case GEOCODE_STARTED:
      return {
        ...state,
        error: false,
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
        geocodeError: action.code || -1,
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
    case GEOCODE_CLEAR_ERROR:
      return {
        ...state,
        geocodeError: 0,
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
