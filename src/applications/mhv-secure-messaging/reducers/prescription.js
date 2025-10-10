import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * Data for a prescription retrieved by ID for renewal messaging process
   * @type {object}
   */
  renewalPrescription: undefined,
  error: undefined,
  isLoading: false,
};

export const prescriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Prescriptions.IS_LOADING:
      return {
        ...initialState,
        isLoading: true,
      };
    case Actions.Prescriptions.GET_PRESCRIPTION_BY_ID:
      return {
        ...initialState,
        renewalPrescription: action.payload,
      };
    case Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR:
      return {
        ...initialState,
        error: action.payload,
      };
    case Actions.Prescriptions.CLEAR_PRESCRIPTION:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
