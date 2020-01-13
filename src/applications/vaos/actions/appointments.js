import moment from 'moment';
import * as Sentry from '@sentry/browser';
import { FETCH_STATUS } from '../utils/constants';
import { getMomentConfirmedDate } from '../utils/appointment';

import {
  getConfirmedAppointments,
  getPendingAppointments,
  getCancelReasons,
  getRequestMessages,
  updateAppointment,
  updateRequest,
  getFacilitiesInfo,
} from '../api';

export const FETCH_FUTURE_APPOINTMENTS = 'vaos/FETCH_FUTURE_APPOINTMENTS';
export const FETCH_FUTURE_APPOINTMENTS_FAILED =
  'vaos/FETCH_FUTURE_APPOINTMENTS_FAILED';
export const FETCH_FUTURE_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_FUTURE_APPOINTMENTS_SUCCEEDED';

export const FETCH_REQUEST_MESSAGES = 'vaos/FETCH_REQUEST_MESSAGES';
export const FETCH_REQUEST_MESSAGES_FAILED =
  'vaos/FETCH_REQUEST_MESSAGES_FAILED';
export const FETCH_REQUEST_MESSAGES_SUCCEEDED =
  'vaos/FETCH_REQUEST_MESSAGES_SUCCEEDED';

export const CANCEL_APPOINTMENT = 'vaos/CANCEL_APPOINTMENT';
export const CANCEL_APPOINTMENT_CONFIRMED = 'vaos/CANCEL_APPOINTMENT_CONFIRMED';
export const CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED =
  'vaos/CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED';
export const CANCEL_APPOINTMENT_CONFIRMED_FAILED =
  'vaos/CANCEL_APPOINTMENT_CONFIRMED_FAILED';
export const CANCEL_APPOINTMENT_CLOSED = 'vaos/CANCEL_APPOINTMENT_CLOSED';
export const FETCH_FACILITY_LIST_DATA_SUCCEEDED =
  'vaos/FETCH_FACILITY_LIST_DATA_SUCCEEDED';

export function fetchRequestMessages(requestId) {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_REQUEST_MESSAGES,
      });
      const messages = await getRequestMessages(requestId);
      dispatch({
        type: FETCH_REQUEST_MESSAGES_SUCCEEDED,
        requestId,
        messages,
      });
    } catch (error) {
      Sentry.captureException(error);
      dispatch({
        type: FETCH_REQUEST_MESSAGES_FAILED,
        error,
      });
    }
  };
}

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
            moment()
              .startOf('day')
              .toISOString(),
            moment()
              .startOf('day')
              .add(1, 'years')
              .toISOString(),
          ),
          getConfirmedAppointments(
            'cc',
            moment().format('YYYY-MM-DD'),
            moment()
              .add(1, 'years')
              .format('YYYY-MM-DD'),
          ),
          getPendingAppointments(
            moment()
              .subtract(30, 'days')
              .format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD'),
          ),
        ]);
        dispatch({
          type: FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
          data,
          today: moment(),
        });

        const appts = getState().appointments.future;
        const facilityIds = new Set(
          appts
            .map(appt => appt.facilityId || appt.facility?.facilityCode)
            .filter(id => !!id),
        );

        try {
          if (facilityIds.size > 0) {
            const facilityData = await getFacilitiesInfo(
              Array.from(facilityIds),
            );
            dispatch({
              type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
              facilityData,
            });
          }
        } catch (error) {
          Sentry.captureException(error);
        }
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

const UNABLE_TO_KEEP_APPT = '5';
const VALID_CANCEL_CODES = new Set(['4', '5', '6']);

export function cancelAppointment(appointment) {
  return {
    type: CANCEL_APPOINTMENT,
    appointment,
  };
}

const SUBMITTED_REQUEST = 'Submitted';
const CANCELLED_REQUEST = 'Cancelled';
export function confirmCancelAppointment() {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED,
      });

      const appointment = getState().appointments.appointmentToCancel;

      if (appointment.status === SUBMITTED_REQUEST) {
        await updateRequest({
          ...appointment,
          status: CANCELLED_REQUEST,
          appointmentRequestDetailCode: ['DETCODE8'],
        });
      } else {
        const cancelData = {
          appointmentTime: getMomentConfirmedDate(appointment).format(
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
