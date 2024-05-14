import {
  UPDATE_BANK_INFO,
  UPDATE_BANK_INFO_FAILED,
  UPDATE_BANK_INFO_SUCCESS,
} from '../actions';

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const bankInfo = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BANK_INFO:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_BANK_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.response,
      };
    case UPDATE_BANK_INFO_FAILED:
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
export default bankInfo;
