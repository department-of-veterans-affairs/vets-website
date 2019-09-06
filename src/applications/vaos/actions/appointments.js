// Mock Data
import confirmed from './confirmed.json';
import pending from './requests.json';
import past from './past.json';

export const FETCH_PENDING_APPOINTMENTS = 'vaos/FETCH_PENDING_APPOINTMENTS';
export const FETCH_PENDING_APPOINTMENTS_FAILED =
  'vaos/FETCH_PENDING_APPOINTMENTS_FAILED';
export const FETCH_PENDING_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_PENDING_APPOINTMENTS_SUCCEEDED';

export const FETCH_CONFIRMED_APPOINTMENTS = 'vaos/FETCH_CONFIRMED_APPOINTMENTS';
export const FETCH_CONFIRMED_APPOINTMENTS_FAILED =
  'vaos/FETCH_CONFIRMED_APPOINTMENTS_FAILED';
export const FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED';

export const FETCH_PAST_APPOINTMENTS = 'vaos/FETCH_PAST_APPOINTMENTS';
export const FETCH_PAST_APPOINTMENTS_FAILED =
  'vaos/FETCH_PAST_APPOINTMENTS_FAILED';
export const FETCH_PAST_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_PAST_APPOINTMENTS_SUCCEEDED';

export function fetchConfirmedAppointments() {
  return dispatch => {
    dispatch({
      type: FETCH_CONFIRMED_APPOINTMENTS,
    });

    // Mock API Call
    setTimeout(() => {
      dispatch({
        type: FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
        data: confirmed,
      });
    }, 2000);
  };
}

export function fetchPendingAppointments() {
  return dispatch => {
    dispatch({
      type: FETCH_PENDING_APPOINTMENTS,
    });

    // Mock API Call
    setTimeout(() => {
      dispatch({
        type: FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
        data: pending,
      });
    }, 2000);
  };
}

export function fetchPastAppointments() {
  return dispatch => {
    dispatch({
      type: FETCH_PAST_APPOINTMENTS,
    });

    // Mock API Call
    setTimeout(() => {
      dispatch({
        type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
        data: past,
      });
    }, 2000);
  };
}
