import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from '~/platform/utilities/api';
import moment from '~/applications/personalization/dashboard/lib/moment-tz';
import {
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS,
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED,
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED,
} from '~/applications/personalization/dashboard/constants';

import { vaosV2Helpers } from './utils';

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
