export const SET_DATE_TIME = 'SET_DATE_TIME';
export const SET_FACILITY = 'SET_FACILITY';
export const SET_APPOINTMENT_DETAILS = 'SET_APPOINTMENT_DETAILS';

export function setDateTime(dateTime) {
  return {
    type: SET_DATE_TIME,
    payload: dateTime,
  };
}

export function setFacility(facility) {
  return {
    type: SET_FACILITY,
    payload: facility,
  };
}

export function setAppointmentDetails(dateTime, facility) {
  return {
    type: SET_APPOINTMENT_DETAILS,
    payload: {
      dateTime,
      facility,
    },
  };
}
