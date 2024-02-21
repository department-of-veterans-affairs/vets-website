import {
  UPDATE_ADDRESS,
  UPDATE_ADDRESS_FAILURE,
  UPDATE_ADDRESS_SUCCESS,
} from '../actions';

const initialState = {
  loading: false,
  address: null,
  error: null,
  message: null,
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
        message: 'Address updated Successfuly',
      };
    case UPDATE_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.errors,
      };
    default:
      return state;
  }
};

export default updateAddress;
