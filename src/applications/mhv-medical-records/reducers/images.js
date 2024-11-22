import { Actions } from '../util/actionTypes';
import { extractImageAndSeriesIds } from '../util/helpers';

const initialState = {
  /**
   * The last time that the list was fetched and known to be up-to-date
   * @type {Object}
   */
  imageStatus: undefined,

  /**
   * The last time that the list was fetched and known to be up-to-date
   * @type {Array}
   */
  imageList: [],

  /**
   * The last time that the list was fetched and known to be up-to-date
   * @type {Array}
   */
  imageStudies: undefined,

  /**
   * The last time that the list was fetched and known to be up-to-date
   * @type {Object}
   */
  imageStudy: undefined,
};

export const imagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Images.GET_IMAGE_REQUEST_STATUS: {
      return {
        ...state,
        imageStatus: action.response,
      };
    }
    case Actions.Images.GET_IMAGE_LIST: {
      return {
        ...state,
        imageList: extractImageAndSeriesIds(action.response),
      };
    }
    case Actions.Images.GET_IMAGE_STUDIES: {
      return {
        ...state,
        imageStudies: action.response,
      };
    }
    case Actions.Images.GET_IMAGE_STUDY: {
      return {
        ...state,
        imageStudy: action.response,
      };
    }
    default:
      return state;
  }
};
