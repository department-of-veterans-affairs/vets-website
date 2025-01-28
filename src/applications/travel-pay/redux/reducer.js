import {
  FETCH_TRAVEL_CLAIMS_STARTED,
  FETCH_TRAVEL_CLAIMS_SUCCESS,
  FETCH_TRAVEL_CLAIMS_FAILURE,
  FETCH_APPOINTMENT_STARTED,
  FETCH_APPOINTMENT_SUCCESS,
  FETCH_APPOINTMENT_FAILURE,
} from './actions';

const initialState = {
  hasFetchedData: false,
  isLoading: false,
  isError: false,
  error: null,
  travelClaims: [],
  hasFetchedAppointment: false,
  isLoadingAppointment: false,
  isAppointmentError: false,
  appointmentData: {},
  appointmentError: null,
};

function travelPayReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRAVEL_CLAIMS_STARTED:
      return {
        ...state,
        hasFetchedData: false,
        isLoading: true,
      };
    case FETCH_TRAVEL_CLAIMS_SUCCESS:
      return {
        ...state,
        hasFetchedData: true,
        isLoading: false,
        travelClaims: action.payload,
      };
    case FETCH_TRAVEL_CLAIMS_FAILURE:
      return {
        ...state,
        hasFetchedData: true,
        isLoading: false,
        isError: true,
        error: action.error,
      };
    case FETCH_APPOINTMENT_STARTED:
      return {
        ...state,
        hasFetchedAppointment: false,
        isLoadingAppointment: true,
      };
    case FETCH_APPOINTMENT_SUCCESS:
      return {
        ...state,
        hasFetchedAppointment: true,
        isLoadingAppointment: false,
        appointmentData: action.payload,
      };
    case FETCH_APPOINTMENT_FAILURE:
      return {
        ...state,
        hasFetchedAppointment: true,
        isLoadingAppointment: false,
        isAppointmentError: true,
        appointmentError: action.error,
      };
    default:
      return state;
  }
}

export default {
  travelPay: travelPayReducer,
};
