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
        timestampCCD: action.response,
      };
    }
    default: {
      return { ...state };
    }
  }
};
