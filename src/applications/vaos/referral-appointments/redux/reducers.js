import {
  SET_FACILITY,
  SET_APPOINTMENT_DETAILS,
  SET_SORT_PROVIDER_BY,
  SET_SELECTED_PROVIDER,
} from './actions';

const initialState = {
  facility: null,
  sortProviderBy: '',
  selectedProvider: '',
};

function ccAppointmentReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FACILITY:
      return {
        ...state,
        facility: action.payload,
      };
    case SET_APPOINTMENT_DETAILS:
      return {
        ...state,
        dateTime: action.payload.dateTime,
        facility: action.payload.facility,
      };
    case SET_SORT_PROVIDER_BY:
      return {
        ...state,
        sortProviderBy: action.payload,
      };
    case SET_SELECTED_PROVIDER:
      return {
        ...state,
        selectedProvider: action.payload,
      };
    default:
      return state;
  }
}

export default ccAppointmentReducer;
