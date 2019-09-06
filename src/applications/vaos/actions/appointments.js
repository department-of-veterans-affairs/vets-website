import { getAppointmentSummary } from 'applications/vaos/api/mockApi';

export const FETCH_APPOINTMENT_SUMMARY = 'FETCH_APPOINTMENT_SUMMARY';
export const FETCH_APPOINTMENT_SUMMARY_FAILED =
  'FETCH_APPOINTMENT_SUMMARY_FAILED';
export const FETCH_APPOINTMENT_SUMMARY_SUCCEEDED =
  'FETCH_APPOINTMENT_SUMMARY_SUCCEEDED';

export function fetchAppointmentSummary() {
  return async dispatch => {
    dispatch({
      type: FETCH_APPOINTMENT_SUMMARY,
    });

    try {
      const data = await getAppointmentSummary();

      dispatch({
        type: FETCH_APPOINTMENT_SUMMARY_SUCCEEDED,
        data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_APPOINTMENT_SUMMARY_FAILED,
      });
    }
  };
}
