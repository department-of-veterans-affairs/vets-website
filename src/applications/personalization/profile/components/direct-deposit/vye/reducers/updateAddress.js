import {
  UPDATE_ADDRESS,
  UPDATE_ADDRESS_FAILURE,
  UPDATE_ADDRESS_SUCCESS,
} from '../actions';

const initialState = {
  loading: false,
  data: null,
  error: null,
};
const updateAddress = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ADDRESS:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.response,
      };
    case UPDATE_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.errors,
      };
    case 'RESET_SUCCESS_MESSAGE':
      return {
        ...state,
        data: null,
      };
    case 'RESET_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default updateAddress;
