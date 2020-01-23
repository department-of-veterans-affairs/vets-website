import { FETCH_DATA_FAILURE, FETCH_DATA_SUCCESS, UPDATE_DATA_FAILURE, UPDATE_DATA_SUCCESS } from '../constants';

const initialState = {
  dlcData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        dlcData: action.data,
      };

    case FETCH_DATA_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    case UPDATE_DATA_SUCCESS:
      return {
        ...state,
        dlcData: state.data.concat(action.data),
      };

    case UPDATE_DATA_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};
