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

import { FETCH_STATUS, CANCELLED_APPOINTMENT_SET } from '../utils/constants';
import moment from 'moment';

const initialState = {
  confirmed: null,
  confirmedStatus: FETCH_STATUS.notStarted,
  pending: null,
  pendingStatus: FETCH_STATUS.notStarted,
  past: null,
  pastStatus: FETCH_STATUS.notStarted,
};

function parseVAorCCDate(item) {
  // This means it's a CC appt, which has a different date format
  if (item.appointmentTime) {
    return moment(item.appointmentTime, 'MM/DD/YYYY HH:mm:ss');
  }

  return moment(item.startDate);
}

export default function appointmentsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CONFIRMED_APPOINTMENTS:
      return {
        ...state,
        confirmedStatus: FETCH_STATUS.loading,
      };
    case FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED: {
      const vaAppointments = action.data.vaAppointments.filter(
        appt =>
          !CANCELLED_APPOINTMENT_SET.has(
            appt.vdsAppointments?.[0].currentStatus || 'FUTURE',
          ),
      );

      const confirmed = vaAppointments.concat(action.data.ccAppointments);

      confirmed.sort((a, b) => {
        const date1 = parseVAorCCDate(a);
        const date2 = parseVAorCCDate(b);
        if (date1.isValid() && date2.isValid()) {
          return date1.isBefore(date2) ? -1 : 1;
        }

        return 0;
      });
      return {
        ...state,
        confirmedStatus: FETCH_STATUS.succeeded,
        confirmed,
      };
    }
    case FETCH_CONFIRMED_APPOINTMENTS_FAILED:
      return {
        ...state,
        confirmedStatus: FETCH_STATUS.failed,
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
        pendingStatus: FETCH_STATUS.succeeded,
        pending,
      };
    }
    case FETCH_PENDING_APPOINTMENTS_FAILED:
      return {
        ...state,
        pendingStatus: FETCH_STATUS.failed,
        pending: null,
      };
    case FETCH_PAST_APPOINTMENTS:
      return {
        ...state,
        pastStatus: FETCH_STATUS.loading,
      };
    case FETCH_PAST_APPOINTMENTS_SUCCEEDED:
      return {
        ...state,
        pastStatus: FETCH_STATUS.succeeded,
        past: action.data,
      };
    case FETCH_PAST_APPOINTMENTS_FAILED:
      return {
        ...state,
        pastStatus: FETCH_STATUS.failed,
        past: null,
      };
    default:
      return state;
  }
}
