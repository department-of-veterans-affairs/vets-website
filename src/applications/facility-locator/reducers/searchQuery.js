import {
  SEARCH_STARTED,
  SEARCH_FAILED,
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
  GEOLOCATE_USER,
} from '../actions/actionTypes';

export const INITIAL_STATE = {
  searchString: '',
  serviceType: null,
  vamcServiceDisplay: null,
  facilityType: null,
  position: {
    latitude: 40.17887331434698,
    longitude: -99.27246093750001,
  },
  bounds: [-77.53653, 38.3976763, -76.53653, 39.3976763],
  currentPage: 1,
  zoomLevel: 4,
  inProgress: false,
  searchBoundsInProgress: false,
  fetchSvcsInProgress: false,
  geocodeInProgress: false,
  geocodeResults: [],
  mapMoved: false,
  error: false,
  isValid: true,
  searchStarted: false,
};

export const validateForm = (oldState, payload) => {
  const newState = {
    ...oldState,
    ...payload,
  };
  const needServiceType = newState.facilityType === 'provider';

  return {
    isValid:
      newState.searchString?.length > 0 &&
      newState.facilityType?.length > 0 &&
      (needServiceType ? newState.serviceType?.length > 0 : true),
    locationChanged: oldState.searchString !== newState.searchString,
    facilityTypeChanged: oldState.facilityType !== newState.facilityType,
    serviceTypeChanged: oldState.serviceType !== newState.serviceType,
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
        mapMoved: false,
        searchStarted: true,
      };
    case FETCH_LOCATIONS:
      return {
        ...state,
        ...action.payload,
        error: false,
        inProgress: false,
        searchBoundsInProgress: false,
        mapMoved: false,
        ...validateForm(state, action.payload),
      };
    case MAP_MOVED:
      return {
        ...state,
        mapMoved: true,
        currentRadius: action.currentRadius,
      };
    case FETCH_LOCATION_DETAIL:
      return {
        ...state,
        error: false,
        ...validateForm(state, action.payload),
        inProgress: false,
        mapMoved: false,
      };
    case FETCH_SPECIALTIES:
      return {
        ...state,
        fetchSvcsError: null,
        fetchSvcsInProgress: true,
        specialties: {},
        fetchSvcsRawData: [],
      };
    case FETCH_SPECIALTIES_DONE:
      return {
        ...state,
        error: false,
        fetchSvcsError: null,
        fetchSvcsInProgress: false,
        fetchSvcsRawData: action.data,
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
        fetchSvcsError: action.error || true,
        facilityType: '',
        isValid: true,
      }; // resets facility type to the Choose a facility
    case SEARCH_FAILED:
      return {
        ...state,
        error: true,
        inProgress: false,
        searchBoundsInProgress: false,
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
        searchString: '',
        isValid: false,
        locationChanged: true,
      };
    default:
      return state;
  }
};
