export const SET_APP = 'SET_APP';

export const setApp = application => {
  return {
    type: SET_APP,
    payload: { app: application },
  };
};

export const RECORD_ANSWER = 'RECORD_ANSWER';

export const recordAnswer = answer => {
  return {
    type: RECORD_ANSWER,
    payload: answer,
  };
};

export const SET_ERROR = 'SET_ERROR';

export const setError = errorString => {
  return {
    type: SET_ERROR,
    payload: { error: errorString },
  };
};

export const SET_FORM = 'SET_FORM';

export const setForm = form => {
  return {
    type: SET_FORM,
    payload: { ...form },
  };
};

export const RECEIVED_UPCOMING_APPOINTMENTS = 'RECEIVED_UPCOMING_APPOINTMENTS';

export const recievedUpcomingAppointments = payload => {
  const data = { upcomingAppointments: [...payload] };

  return {
    type: RECEIVED_UPCOMING_APPOINTMENTS,
    payload: {
      ...data,
    },
  };
};
