import {
  ADDRESS_VALIDATION_FAIL,
  ADDRESS_VALIDATION_START,
  ADDRESS_VALIDATION_SUCCESS,
} from '../actions';

// Initial state of the reducer
const initialState = {
  isLoadingValidateAddress: false,
  validationError: null,
  validationSuccess: false,
  addressValidationData: null,
};

function addressReducer(state = initialState, action) {
  switch (action.type) {
    case ADDRESS_VALIDATION_START:
      return {
        ...state,
        isLoadingValidateAddress: true,
        validationError: null,
        validationSuccess: false,
        addressValidationData: null,
      };
    case ADDRESS_VALIDATION_SUCCESS:
      return {
        ...state,
        isLoadingValidateAddress: false,
        validationSuccess: true,
        addressValidationData: action.payload,
      };
    case ADDRESS_VALIDATION_FAIL:
      return {
        ...state,
        isLoadingValidateAddress: false,
        validationError: action.payload,
        validationSuccess: false,
      };
    case 'RESET_ADDRESS_VALIDATIONS':
      return {
        ...state,
        isLoadingValidateAddress: false,
        validationSuccess: false,
        addressValidationData: null,
      };
    case 'RESET_ADDRESS_VALIDATIONS_ERROR':
      return {
        ...state,
        validationError: null,
      };
    default:
      return state;
  }
}

export default addressReducer;
