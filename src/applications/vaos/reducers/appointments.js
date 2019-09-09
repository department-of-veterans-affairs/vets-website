import {
  FETCH_CONFIRMED_APPOINTMENTS,
  FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
  FETCH_CONFIRMED_APPOINTMENTS_FAILED,
  FETCH_PENDING_APPOINTMENTS,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  FETCH_PENDING_APPOINTMENTS_FAILED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS_FAILED,
} from '../actions/appointments';

import { FETCH_STATUS } from '../utils/constants';

const initialState = {
  confirmed: null,
  confirmedLoading: true,
  pending: null,
  pendingStatus: FETCH_STATUS.notStarted,
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
    case FETCH_CONFIRMED_APPOINTMENTS_FAILED:
      return {
        ...state,
        confirmedLoading: false,
        confirmed: null,
      };
    case FETCH_PENDING_APPOINTMENTS:
      return {
        ...state,
        pendingStatus: FETCH_STATUS.loading,
      };
    case FETCH_PENDING_APPOINTMENTS_SUCCEEDED: {
      const pending = action.data.appointmentRequests.filter(
        req => req.status === 'Submitted',
      );
      pending.sort((a, b) => {
        if (a.appointmentType < b.appointmentType) {
          return -1;
        } else if (a.appointmentType > b.appointmentType) {
          return 1;
        }
        return 0;
      });

      return {
        ...state,
        pendingStatus: FETCH_STATUS.successful,
        pending,
      };
    }
    case FETCH_PENDING_APPOINTMENTS_FAILED:
      return {
        ...state,
        pendingStatus: FETCH_STATUS.error,
        pending: null,
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
    case FETCH_PAST_APPOINTMENTS_FAILED:
      return {
        ...state,
        pastLoading: false,
        past: null,
      };
    default:
      return state;
  }
}
