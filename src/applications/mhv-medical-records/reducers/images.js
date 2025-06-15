import { Actions } from '../util/actionTypes';
import { extractImageAndSeriesIds } from '../util/helpers';

const initialState = {
  imageStatus: undefined,

  imageList: [],

  notificationStatus: undefined,

  imageRequestApiFailed: false,
};

export const imagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Images.REQUEST_IMAGE_STUDY: {
      return {
        ...state,
        imageStatus: [action.response],
      };
    }
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
    case Actions.Images.GET_NOTIFICATION_STATUS: {
      return {
        ...state,
        notificationStatus: action?.payload?.flag ?? null,
      };
    }
    case Actions.Images.SET_REQUEST_LIMIT_REACHED: {
      return {
        ...state,
        studyRequestLimitReached: action?.payload ?? false,
      };
    }
    case Actions.Images.SET_REQUEST_API_FAILED: {
      return {
        ...state,
        imageRequestApiFailed: action?.payload ?? false,
      };
    }
    default:
      return state;
  }
};
