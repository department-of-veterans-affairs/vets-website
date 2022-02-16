import {
  FETCH_FACILITY_FAILED,
  FETCH_FACILITY_STARTED,
  FETCH_FACILITY_SUCCESS,
  FETCH_MAIN_SATELLITE_LOCATION_FAILED,
  FETCH_MAIN_SATELLITE_LOCATION_STARTED,
  FETCH_MAIN_SATELLITE_LOCATION_SUCCESS,
  FETCH_MULTI_FACILITY_FAILED,
  FETCH_MULTI_FACILITY_STARTED,
  FETCH_MULTI_FACILITY_SUCCESS,
} from '../actions';

const initialState = {
  loading: false,
  data: {},
  error: false,
  multidata: {},
  multiLoading: {},
  multiError: {},
};

function retrieveMultiLoading(state) {
  return state.multiLoading ? state.multiLoading : {};
}

function retrieveMultiError(state) {
  return state.multiError ? state.multiError : {};
}

function retrieveMultiData(state) {
  return state.multidata ? state.multidata : {};
}

function retrieveData(state) {
  return state.data ? state.data : {};
}

export function facilityReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MULTI_FACILITY_STARTED: {
      const tempMultiData = retrieveMultiData(state);
      const tempMultiLoading = retrieveMultiLoading(state);
      const tempMultiError = retrieveMultiError(state);
      tempMultiLoading[action.facilityID] = true;
      tempMultiError[action.facilityID] = false;
      tempMultiData[action.facilityID] = {};
      return {
        ...state,
        multidata: tempMultiData,
        multiError: tempMultiError,
        multiLoading: tempMultiLoading,
      };
    }
    case FETCH_MAIN_SATELLITE_LOCATION_STARTED:
      return { ...state, data: {}, loading: true, error: false };
    case FETCH_FACILITY_STARTED:
      return { ...state, data: {}, loading: true, error: false };
    case FETCH_FACILITY_SUCCESS:
      return { data: action.facility, loading: false, error: false };
    case FETCH_MAIN_SATELLITE_LOCATION_SUCCESS:
      return {
        multidata: retrieveMultiData(state),
        data: action.facility,
        loading: false,
        error: false,
      };
    case FETCH_MULTI_FACILITY_SUCCESS: {
      const tempMultiData = retrieveMultiData(state);
      const tempMultiLoading = retrieveMultiLoading(state);
      const tempMultiError = retrieveMultiError(state);
      tempMultiLoading[action.facilityID] = false;
      tempMultiError[action.facilityID] = false;
      tempMultiData[action.facilityID] = action.facility;
      return {
        ...state,
        multidata: tempMultiData,
        multiError: tempMultiError,
        multiLoading: tempMultiLoading,
      };
    }
    case FETCH_FACILITY_FAILED:
      return { data: {}, loading: false, error: true };
    case FETCH_MAIN_SATELLITE_LOCATION_FAILED:
      return {
        data: retrieveData(state),
        multidata: retrieveMultiData(state),
        loading: false,
        error: true,
      };
    case FETCH_MULTI_FACILITY_FAILED: {
      const tempMultiData = retrieveMultiData(state);
      const tempMultiLoading = retrieveMultiLoading(state);
      const tempMultiError = retrieveMultiError(state);
      tempMultiLoading[action.facilityID] = false;
      tempMultiError[action.facilityID] = true;
      tempMultiData[action.facilityID] = {};
      return {
        ...state,
        multidata: tempMultiData,
        multiError: tempMultiError,
        multiLoading: tempMultiLoading,
      };
    }
    default:
      return state;
  }
}

export default {
  facility: facilityReducer,
};
