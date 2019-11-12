import moment from 'moment';
import * as Sentry from '@sentry/browser';
import { FETCH_STATUS } from '../utils/constants';

import {
  getConfirmedAppointments,
  getPendingAppointments,
  getPastAppointments,
  getCancelReasons,
  updateAppointment,
  updateRequest,
} from '../api';

export const FETCH_FUTURE_APPOINTMENTS = 'vaos/FETCH_FUTURE_APPOINTMENTS';
export const FETCH_FUTURE_APPOINTMENTS_FAILED =
  'vaos/FETCH_FUTURE_APPOINTMENTS_FAILED';
export const FETCH_FUTURE_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_FUTURE_APPOINTMENTS_SUCCEEDED';

export const FETCH_PAST_APPOINTMENTS = 'vaos/FETCH_PAST_APPOINTMENTS';
export const FETCH_PAST_APPOINTMENTS_FAILED =
  'vaos/FETCH_PAST_APPOINTMENTS_FAILED';
export const FETCH_PAST_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_PAST_APPOINTMENTS_SUCCEEDED';
export const CANCEL_APPOINTMENT = 'vaos/CANCEL_APPOINTMENT';
export const CANCEL_APPOINTMENT_CONFIRMED = 'vaos/CANCEL_APPOINTMENT_CONFIRMED';
export const CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED =
  'vaos/CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED';
export const CANCEL_APPOINTMENT_CONFIRMED_FAILED =
  'vaos/CANCEL_APPOINTMENT_CONFIRMED_FAILED';
export const CANCEL_APPOINTMENT_CLOSED = 'vaos/CANCEL_APPOINTMENT_CLOSED';

export function fetchFutureAppointments() {
  return async (dispatch, getState) => {
    if (getState().appointments.futureStatus === FETCH_STATUS.notStarted) {
      dispatch({
        type: FETCH_FUTURE_APPOINTMENTS,
      });

      try {
        const data = await Promise.all([
          getConfirmedAppointments(
            'va',
            moment().format('YYYY-MM-DD'),
            moment()
              .add(4, 'months')
              .format('YYYY-MM-DD'),
          ),
          getConfirmedAppointments(
            'cc',
            moment().format('YYYY-MM-DD'),
            moment()
              .add(4, 'months')
              .format('YYYY-MM-DD'),
          ),
          getPendingAppointments(
            moment()
              .subtract(4, 'months')
              .format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD'),
          ),
        ]);
        dispatch({
          type: FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
          data,
          today: moment(),
        });
      } catch (error) {
        Sentry.captureException(error);
        dispatch({
          type: FETCH_FUTURE_APPOINTMENTS_FAILED,
          error,
        });
      }
    }
  };
}

export function fetchPastAppointments() {
  return dispatch => {
    dispatch({
      type: FETCH_PAST_APPOINTMENTS,
    });

    getPastAppointments(moment().subtract(6, 'months')).then(data => {
      dispatch({
        type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
        data,
      });
    });
  };
}

const UNABLE_TO_KEEP_APPT = '5';
const VALID_CANCEL_CODES = new Set(['4', '5', '6']);

export function cancelAppointment(appointment) {
  return {
    type: CANCEL_APPOINTMENT,
    appointment,
  };
}

const BOOKED_REQUEST = 'Booked';
const CANCELLED_REQUEST = 'Cancelled';
export function confirmCancelAppointment() {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED,
      });

      const appointment = getState().appointments.appointmentToCancel;

      if (appointment.status === BOOKED_REQUEST) {
        await updateRequest({
          ...appointment,
          status: CANCELLED_REQUEST,
        });
      } else {
        const cancelData = {
          appointmentTime: moment(appointment.startDate).format(
            'MM/DD/YYYY HH:mm:ss',
          ),
          clinicId: appointment.clinicId,
          remarks: '',
          clinicName: appointment.vdsAppointments[0].clinic.name,
          cancelCode: 'PC',
        };

        const cancelReasons = await getCancelReasons(
          appointment.facilityId.substr(0, 3),
        );

        if (
          cancelReasons.find(reason => reason.number === UNABLE_TO_KEEP_APPT)
        ) {
          await updateAppointment({
            ...cancelData,
            cancelReason: UNABLE_TO_KEEP_APPT,
          });
        } else if (
          cancelReasons.some(reason => VALID_CANCEL_CODES.has(reason))
        ) {
          const cancelReason = cancelReasons.find(reason =>
            VALID_CANCEL_CODES.has(reason),
          );
          await updateAppointment({
            ...cancelData,
            cancelReason: cancelReason.number,
          });
        } else {
          throw new Error('Unable to find valid cancel reason');
        }
      }

      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
      });
    } catch (e) {
      Sentry.captureException(e);
      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED_FAILED,
      });
    }
  };
}

export function closeCancelAppointment() {
  return {
    type: CANCEL_APPOINTMENT_CLOSED,
  };
}
