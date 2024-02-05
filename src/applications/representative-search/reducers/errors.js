import {
  SEARCH_FAILED,
  REPORT_COMPLETE,
  REPORT_FAILED,
  REPORT_ITEMS_UPDATED,
  GEOCODE_FAILED,
  CLEAR_ERROR,
  GEOCODE_STARTED,
  SEARCH_COMPLETE,
  SEARCH_STARTED,
  FETCH_REPRESENTATIVES,
} from '../utils/actionTypes';

export const INITIAL_STATE = {
  isErrorFetchRepresentatives: null,
  isErrorReportSubmission: null,
  isErrorGeocode: null,
};

export const ErrorsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CLEAR_ERROR: {
      const { errorType } = action.payload;

      return { ...state, [errorType]: null };
    }
    case GEOCODE_STARTED:
    case SEARCH_COMPLETE:
    case SEARCH_STARTED:
    case FETCH_REPRESENTATIVES:
      return {
        ...state,
        isErrorFetchRepresentatives: null,
      };

    case REPORT_COMPLETE:
      return {
        ...state,
        isErrorReportSubmission: null,
      };
    // case CLEAR_GEOCODE_ERROR:
    //   return {
    //     ...state,
    //     isErrorGeocode: 0,
    //   };
    case REPORT_ITEMS_UPDATED:
      return {
        ...state,
        error: null,
      };
    case GEOCODE_FAILED:
      return {
        ...state,
        isErrorGeocode: action.code || -1,
      };
    case SEARCH_FAILED:
      if (action.error) {
        return {
          ...INITIAL_STATE,
          isErrorFetchRepresentatives: action.error,
        };
      }
      return INITIAL_STATE;

    case REPORT_FAILED:
      return {
        ...state,
        isErrorReportSubmission: true,
      };
    default:
      return state;
  }
};
