import {
  FETCH_CONFIRMED_APPOINTMENTS,
  FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
  FETCH_PENDING_APPOINTMENTS,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
} from '../actions/appointments';

const initialState = {
  confirmed: null,
  confirmedLoading: true,
  pending: null,
  pendingLoading: true,
  past: null,
  pastLoading: true,
};

export default function appointmentsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CONFIRMED_APPOINTMENTS:
      return {
        ...state,
        confirmedLoading: true,
      };
    case FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED:
      return {
        ...state,
        confirmedLoading: false,
        confirmed: action.data,
      };
    case FETCH_PENDING_APPOINTMENTS:
      return {
        ...state,
        pendingLoading: true,
      };
    case FETCH_PENDING_APPOINTMENTS_SUCCEEDED:
      return {
        ...state,
        pendingLoading: false,
        pending: action.data.appointmentRequests.filter(
          req => req.status === 'Submitted',
        ),
      };
    case FETCH_PAST_APPOINTMENTS:
      return {
        ...state,
        pastLoading: true,
      };
    case FETCH_PAST_APPOINTMENTS_SUCCEEDED:
      return {
        ...state,
        pastLoading: false,
        past: action.data,
      };
    default:
      return state;
  }
}
