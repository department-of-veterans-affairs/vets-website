import { Actions } from '../util/actionTypes';

const initialState = {};

export const downloadsReducer = (state = initialState, action) => {
  switch (action.type) {
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
    default: {
      return { ...state };
    }
  }
};
