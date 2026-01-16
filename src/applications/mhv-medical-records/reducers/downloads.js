import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * Awaiting CCD generation
   * @type {Boolean}
   */
  generatingCCD: false,
  /**
   * Timestamp used for downloading CCD
   * @type {string}
   */
  timestampCCD: undefined,
  /**
   * Error in generation of CCD
   * @type {Boolean}
   */
  error: false,
  /**
   * CCD download completed successfully
   * @type {Boolean}
   */
  ccdDownloadSuccess: false,
  dateFilter: {},
};

export const downloadsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Downloads.GENERATE_CCD: {
      return {
        ...state,
        generatingCCD: true,
      };
    }
    case Actions.Downloads.DOWNLOAD_CCD: {
      return {
        ...state,
        generatingCCD: false,
        ccdDownloadSuccess: true,
        timestampCCD: action.response,
      };
    }
    case Actions.Downloads.CANCEL_CCD: {
      return {
        ...state,
        generatingCCD: false,
      };
    }
    case Actions.Downloads.CCD_GENERATION_ERROR: {
      return {
        ...state,
        generatingCCD: false,
        timestampCCD: action.response,
        error: true,
      };
    }
    case Actions.Downloads.CCD_CLEAR_ALERT: {
      return {
        ...state,
        ccdDownloadSuccess: false,
        error: false,
      };
    }
    case Actions.Downloads.SET_DATE_FILTER: {
      return {
        ...state,
        dateFilter: action.response,
      };
    }
    case Actions.Downloads.SET_RECORD_FILTER: {
      return {
        ...state,
        recordFilter: action.response,
      };
    }
    case Actions.Downloads.SET_FILE_TYPE_FILTER: {
      return {
        ...state,
        fileTypeFilter: action.response,
      };
    }
    case Actions.Downloads.BB_SUCCESS: {
      return {
        ...state,
        bbDownloadSuccess: true,
      };
    }
    case Actions.Downloads.BB_CLEAR_ALERT: {
      return {
        ...state,
        bbDownloadSuccess: false,
      };
    }
    default: {
      return { ...state };
    }
  }
};
