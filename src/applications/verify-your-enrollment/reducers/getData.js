import { GET_DATA, GET_DATA_SUCCESS } from '../actions';

const initialState = {
  data: null,
  loading: false,
};

const getDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return {
        ...state,
        loading: true,
      };
    case GET_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.response,
      };
    default:
      return state;
  }
};

export default getDataReducer;
