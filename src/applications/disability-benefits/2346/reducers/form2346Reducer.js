import {
  FETCH_VETERAN_INFORMATION,
  FETCH_VETERAN_INFORMATION_FAILURE,
  PERM_ADDRESS_SELECTED_FAILURE,
  PERM_ADDRESS_SELECTED_SUCCESSFUL,
  TEMP_ADDRESS_SELECTED_FAILURE,
  TEMP_ADDRESS_SELECTED_SUCCESSFUL,
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
  permAddressSelected: true,
  tempAddressSelected: false,
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

    case PERM_ADDRESS_SELECTED_SUCCESSFUL: {
      return {
        ...state,
        permAddressSelected: true,
        tempAddressSelected: false,
      };
    }

    case PERM_ADDRESS_SELECTED_FAILURE: {
      return {
        ...state,
        error: action.error,
      };
    }

    case TEMP_ADDRESS_SELECTED_SUCCESSFUL: {
      return {
        ...state,
        permAddressSelected: false,
        tempAddressSelected: true,
      };
    }

    case TEMP_ADDRESS_SELECTED_FAILURE: {
      return {
        ...state,
        error: action.error,
      };
    }

    default:
      return state;
  }
};
