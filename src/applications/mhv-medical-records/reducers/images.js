import { Actions } from '../util/actionTypes';
import { extractImageAndSeriesIds } from '../util/helpers';

const initialState = {
  imageStatus: undefined,

  imageList: [],

  notificationStatus: undefined,
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
    case Actions.Images.GET_NOTIFICATION_STATUS: {
      return {
        ...state,
        notificationStatus: action?.payload?.flag ?? null,
      };
    }

    default:
      return state;
  }
};
