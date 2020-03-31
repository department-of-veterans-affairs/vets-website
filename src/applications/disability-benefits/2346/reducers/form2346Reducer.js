import {
  FETCH_VETERAN_INFORMATION,
  FETCH_VETERAN_INFORMATION_FAILURE,
  PERM_ADDRESS_MILITARY_BASE_DESELECTED,
  PERM_ADDRESS_MILITARY_BASE_SELECTED,
  PERM_ADDRESS_MILITARY_BASE_SELECTION_FAILURE,
  PERM_ADDRESS_SELECTED_FAILURE,
  PERM_ADDRESS_SELECTED_SUCCESSFUL,
  TEMP_ADDRESS_MILITARY_BASE_DESELECTED,
  TEMP_ADDRESS_MILITARY_BASE_SELECTED,
  TEMP_ADDRESS_MILITARY_BASE_SELECTION_FAILURE,
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
  permAddressIsSelected: true,
  tempAddressIsSelected: false,
  permAddressIsAMilitaryBase: false,
  tempAddressIsAMilitaryBase: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VETERAN_INFORMATION:
      return {
        ...state,
        formData: action.data,
      };

    case FETCH_VETERAN_INFORMATION_FAILURE:
    case PERM_ADDRESS_MILITARY_BASE_SELECTION_FAILURE:
    case PERM_ADDRESS_SELECTED_FAILURE:
    case TEMP_ADDRESS_SELECTED_FAILURE:
    case TEMP_ADDRESS_MILITARY_BASE_SELECTION_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    case PERM_ADDRESS_SELECTED_SUCCESSFUL: {
      return {
        ...state,
        permAddressIsSelected: true,
        tempAddressIsSelected: false,
      };
    }

    case TEMP_ADDRESS_SELECTED_SUCCESSFUL: {
      return {
        ...state,
        permAddressIsSelected: false,
        tempAddressIsSelected: true,
      };
    }

    case PERM_ADDRESS_MILITARY_BASE_SELECTED: {
      return {
        ...state,
        permAddressIsAMilitaryBase: true,
      };
    }

    case PERM_ADDRESS_MILITARY_BASE_DESELECTED: {
      return {
        ...state,
        permAddressIsAMilitaryBase: false,
      };
    }

    case TEMP_ADDRESS_MILITARY_BASE_SELECTED: {
      return {
        ...state,
        tempAddressIsAMilitaryBase: true,
      };
    }

    case TEMP_ADDRESS_MILITARY_BASE_DESELECTED: {
      return {
        ...state,
        tempAddressIsAMilitaryBase: false,
      };
    }

    default:
      return state;
  }
};
