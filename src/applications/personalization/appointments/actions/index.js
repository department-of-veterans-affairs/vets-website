import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { apiRequest } from '~/platform/utilities/api';
import moment from '~/applications/personalization/dashboard/lib/moment-tz';

import { vaosV2Helpers } from './utils';

export const FUTURE_APPOINTMENTS_HIDDEN_SET = new Set(['NO-SHOW', 'DELETED']);

export const VIDEO_TYPES = {
  gfe: 'MOBILE_GFE',
  clinic: 'CLINIC_BASED',
  adhoc: 'ADHOC',
  mobile: 'MOBILE_ANY',
  storeForward: 'STORE_FORWARD',
};

export const FETCH_CONFIRMED_FUTURE_APPOINTMENTS =
  'dashboard/FETCH_CONFIRMED_FUTURE_APPOINTMENTS';
export const FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED =
  'dashboard/FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED';
export const FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED =
  'dashboard/FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED';

export function fetchConfirmedFutureAppointments() {
  return async dispatch => {
    dispatch({
      type: FETCH_CONFIRMED_FUTURE_APPOINTMENTS,
    });

    const now = moment().toISOString();

    // Maximum number of days you can schedule an appointment in advance in VAOS
    const endDate = moment()
      .add(395, 'days')
      .startOf('day')
      .toISOString();

    try {
      const appointmentResponse = await apiRequest(
        `/appointments?start=${now}&end=${endDate}&_include=facilities&statuses[]=booked`,
        { apiVersion: 'vaos/v2' },
      );

      // catch errors
      if (appointmentResponse?.errors) {
        dispatch({
          type: FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED,
          errors: [...(appointmentResponse?.errors || [])],
        });
        recordEvent({
          event: `api_call`,
          'error-key': `server error`,
          'api-name': 'GET v2/appointments ',
          'api-status': 'failed',
        });
      } else {
        recordEvent({
          event: `api_call`,
          'api-name': 'GET v2/appointments ',
          'api-status': 'successful',
        });
      }

      const { data: appointments } = appointmentResponse;

      // convert to appointment structure
      const formatted = appointments.map(appointment => {
        return vaosV2Helpers.transformAppointment(appointment);
      });

      // filter out past appointments
      const onlyUpcoming = formatted.filter(appt => appt.isUpcoming);

      // sort by date
      const sorted = vaosV2Helpers.sortAppointments(onlyUpcoming);

      // update redux
      dispatch({
        type: FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED,
        appointments: sorted,
      });
    } catch (error) {
      recordEvent({
        event: `api_call`,
        'error-key': `internal error`,
        'api-name': 'GET v2/appointments',
        'api-status': 'failed',
      });
      const errors = error.errors ?? [error];
      dispatch({
        type: FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED,
        errors,
      });
    }
  };
}
