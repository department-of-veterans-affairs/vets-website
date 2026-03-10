import { Actions } from '../util/actionTypes';

const initialState = {
  data: null,
  error: undefined,
};

export const ohSyncStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.OHSyncStatus.GET: {
      return {
        ...state,
        data: action.response?.data?.attributes || null,
        error: undefined,
      };
    }
    case Actions.OHSyncStatus.GET_ERROR: {
      return {
        ...state,
        data: null,
        error: true,
      };
    }
    default:
      return state;
  }
};
