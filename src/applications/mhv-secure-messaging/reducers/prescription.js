import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * Data for a prescription retrieved by ID for renewal messaging process
   * @type {object}
   */
  renewalPrescription: undefined,
  /**
   * Relative path to redirect user after sending a message
   * @type {string}
   */
  redirectPath: undefined,
  error: undefined,
  isLoading: false,
};

export const prescriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Prescriptions.IS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case Actions.Prescriptions.GET_PRESCRIPTION_BY_ID:
      return {
        ...state,
        isLoading: false,
        renewalPrescription: action.payload,
      };
    case Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case Actions.Prescriptions.CLEAR_PRESCRIPTION:
      return {
        ...initialState,
      };
    case Actions.Prescriptions.SET_REDIRECT_PATH:
      return {
        ...state,
        redirectPath: action.payload,
      };
    default:
      return state;
  }
};
