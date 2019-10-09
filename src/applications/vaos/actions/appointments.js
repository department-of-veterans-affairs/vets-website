import { FETCH_STATUS } from '../utils/constants';
import {
  getConfirmedAppointments,
  getPendingAppointments,
  getPastAppointments,
} from '../api';

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
  return (dispatch, getState) => {
    if (getState().appointments.confirmedStatus === FETCH_STATUS.notStarted) {
      dispatch({
        type: FETCH_CONFIRMED_APPOINTMENTS,
      });

      getConfirmedAppointments().then(data => {
        dispatch({
          type: FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
          data,
        });
      });
    }
  };
}

export function fetchPendingAppointments() {
  return (dispatch, getState) => {
    if (getState().appointments.pendingStatus === FETCH_STATUS.notStarted) {
      dispatch({
        type: FETCH_PENDING_APPOINTMENTS,
      });

      getPendingAppointments().then(data => {
        dispatch({
          type: FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
          data,
        });
      });
    }
  };
}

export function fetchPastAppointments() {
  return dispatch => {
    dispatch({
      type: FETCH_PAST_APPOINTMENTS,
    });

    getPastAppointments().then(data => {
      dispatch({
        type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
        data,
      });
    });
  };
}
