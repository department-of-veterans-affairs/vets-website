import {
  FETCH_VETERAN_INFORMATION,
  FETCH_VETERAN_INFORMATION_FAILURE,
} from '../constants';

const initialState = {
  formData: {
    first: '',
    last: '',
    gender: '',
    dateOfBirth: '',
    addressLine1: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    email: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
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
