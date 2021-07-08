export const WAS_CHECKED_IN = 'WAS_CHECKED_IN';

export const wasCheckedIn = data => {
  return { type: WAS_CHECKED_IN, value: data };
};

export const RECEIVED_APPOINTMENT_DETAILS = 'RECEIVED_APPOINTMENT_DETAILS';

export const receivedAppointmentDetails = data => {
  return { type: RECEIVED_APPOINTMENT_DETAILS, value: data };
};
