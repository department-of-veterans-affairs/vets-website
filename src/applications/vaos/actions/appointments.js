import pending from './requests.json';

export const FETCH_PENDING_APPOINTMENTS = 'vaos/FETCH_PENDING_APPOINTMENTS';
export const FETCH_PENDING_APPOINTMENTS_FAILED =
  'vaos/FETCH_PENDING_APPOINTMENTS_FAILED';
export const FETCH_PENDING_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_PENDING_APPOINTMENTS_SUCCEEDED';

export function fetchPendingAppointments() {
  return dispatch => {
    dispatch({
      type: FETCH_PENDING_APPOINTMENTS,
    });
    setTimeout(() => {
      dispatch({
        type: FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
        data: pending,
      });
    }, 2000);
  };
}
