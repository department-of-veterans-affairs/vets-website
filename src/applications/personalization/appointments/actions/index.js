import { apiRequest } from '../../../../platform/utilities/api';

export const FETCH_APPOINTMENTS = 'FETCH_APPOINTMENTS';
export const FETCH_APPOINTMENTS_SUCCESS = 'FETCH_APPOINTMENTS_SUCCESS';
export const FETCH_APPOINTMENTS_FAILURE = 'FETCH_APPOINTMENTS_FAILURE';

export function fetchAppointments() {
  return dispatch => {
    dispatch({
      type: FETCH_APPOINTMENTS,
    });

    return apiRequest(
      '/appointments',
      null,
      res =>
        dispatch({
          type: FETCH_APPOINTMENTS_SUCCESS,
          data: res.data.attributes.appointments,
        }),
      err => {
        dispatch({
          type: FETCH_APPOINTMENTS_FAILURE,
          err,
        });
      },
    );
  };
}
