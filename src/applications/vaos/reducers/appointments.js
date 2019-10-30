import {
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
  FETCH_CONFIRMED_APPOINTMENTS,
  FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
  FETCH_CONFIRMED_APPOINTMENTS_FAILED,
  FETCH_PENDING_APPOINTMENTS,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  FETCH_PENDING_APPOINTMENTS_FAILED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS_FAILED,
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
} from '../actions/appointments';

import {
  getAppointmentType,
  parseVAorCCDate,
  parseRequestDate,
  filterFutureConfirmedAppointments,
  filterFutureRequests,
} from '../utils/appointment';
import {
  FETCH_STATUS,
  CANCELLED_APPOINTMENT_SET,
  APPOINTMENT_TYPES,
} from '../utils/constants';

const initialState = {
  future: null,
  futureStatus: FETCH_STATUS.notStarted,
  confirmed: null,
  confirmedStatus: FETCH_STATUS.notStarted,
  pending: null,
  pendingStatus: FETCH_STATUS.notStarted,
  past: null,
  pastStatus: FETCH_STATUS.notStarted,
  showCancelModal: false,
  cancelAppointmentStatus: FETCH_STATUS.notStarted,
  appointmentToCancel: null,
};

export default function appointmentsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FUTURE_APPOINTMENTS:
      return {
        ...state,
        futureStatus: FETCH_STATUS.loading,
      };
    case FETCH_FUTURE_APPOINTMENTS_SUCCEEDED: {
      const confirmed = action.data[0] || {
        vaAppointments: [],
        ccAppointments: [],
      };
      const requests = action.data[1]?.appointmentRequests || [];
      const futureAppointments = [
        ...confirmed.vaAppointments.filter(filterFutureConfirmedAppointments),
        ...confirmed.ccAppointments.filter(filterFutureConfirmedAppointments),
        ...requests.filter(filterFutureRequests),
      ];

      futureAppointments.sort((a, b) => {
        const aDate =
          getAppointmentType(a) === APPOINTMENT_TYPES.request
            ? parseRequestDate(a.optionDate1)
            : parseVAorCCDate(a);

        const bDate =
          getAppointmentType(b) === APPOINTMENT_TYPES.request
            ? parseRequestDate(b.optionDate1)
            : parseVAorCCDate(b);

        return aDate.isBefore(bDate) ? -1 : 1;
      });

      return {
        ...state,
        future: futureAppointments,
        futureStatus: FETCH_STATUS.succeeded,
      };
    }
    case FETCH_FUTURE_APPOINTMENTS_FAILED:
      return {
        ...state,
        futureStatus: FETCH_STATUS.failed,
        future: null,
      };
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
      const pending = action.data.appointmentRequests.filter(req =>
        ['Submitted', 'Cancelled'].includes(req.status),
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
    case CANCEL_APPOINTMENT:
      return {
        ...state,
        showCancelModal: true,
        appointmentToCancel: action.appointment,
        cancelAppointmentStatus: FETCH_STATUS.notStarted,
      };
    case CANCEL_APPOINTMENT_CONFIRMED:
      return {
        ...state,
        showCancelModal: true,
        cancelAppointmentStatus: FETCH_STATUS.loading,
      };
    case CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED: {
      const confirmed = state.confirmed.filter(
        appt => appt !== state.appointmentToCancel,
      );
      return {
        ...state,
        showCancelModal: true,
        confirmed,
        cancelAppointmentStatus: FETCH_STATUS.succeeded,
      };
    }
    case CANCEL_APPOINTMENT_CONFIRMED_FAILED:
      return {
        ...state,
        showCancelModal: true,
        cancelAppointmentStatus: FETCH_STATUS.failed,
      };
    case CANCEL_APPOINTMENT_CLOSED:
      return {
        ...state,
        showCancelModal: false,
        appointmentToCancel: null,
        cancelAppointmentStatus: FETCH_STATUS.notStarted,
      };
    default:
      return state;
  }
}
