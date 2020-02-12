import {
  FETCH_VETERAN_ADDRESS_FAILURE,
  FETCH_VETERAN_ADDRESS_SUCCESS,
  FETCH_VETERAN_INFORMATION,
  FETCH_VETERAN_INFORMATION_FAILURE,
} from '../constants';

const initialState = {
  formData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VETERAN_ADDRESS_SUCCESS:
      return {
        ...state,
        formData: action.data,
      };

    case FETCH_VETERAN_ADDRESS_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    case FETCH_VETERAN_INFORMATION:
      return {
        ...state,
        formData: action.data,
      };

    case FETCH_VETERAN_INFORMATION_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};
