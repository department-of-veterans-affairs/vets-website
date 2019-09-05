import {
  FETCH_PENDING_APPOINTMENTS,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
} from '../actions/appointments';

const initialState = {
  pending: null,
  pendingLoading: true,
};

export default function appointmentsReducer(state = initialState, action) {
  switch (action.type) {
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
    default:
      return state;
  }
}
