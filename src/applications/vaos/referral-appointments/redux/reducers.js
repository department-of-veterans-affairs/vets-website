import {
  SET_DATE_TIME,
  SET_FACILITY,
  SET_APPOINTMENT_DETAILS,
} from './actions';

const initialState = {
  dateTime: null,
  facility: null,
};

function ccAppointmentReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATE_TIME:
      return {
        ...state,
        dateTime: action.payload,
      };
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
    default:
      return state;
  }
}

export default ccAppointmentReducer;
