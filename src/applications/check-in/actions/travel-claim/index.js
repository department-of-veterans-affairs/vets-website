export const RECEIVED_TRAVEL_DATA = 'RECEIVED_TRAVEL_DATA';

export const receivedTravelData = payload => {
  return {
    type: RECEIVED_TRAVEL_DATA,
    payload,
  };
};

export const SET_FILTERED_APPOINTMENTS = 'SET_FILTERED_APPOINTMENTS';

export const setFilteredAppointments = payload => {
  return {
    type: SET_FILTERED_APPOINTMENTS,
    payload,
  };
};

export const SET_FORM_DATA = 'SET_FORM_DATA';

export const setFormData = data => {
  return {
    type: SET_FORM_DATA,
    payload: data,
  };
};
