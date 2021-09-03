export const WAS_CHECKED_IN = 'WAS_CHECKED_IN';

export const wasCheckedIn = data => {
  return { type: WAS_CHECKED_IN, value: data };
};

export const RECEIVED_APPOINTMENT_DETAILS = 'RECEIVED_APPOINTMENT_DETAILS';

export const receivedAppointmentDetails = (data, token) => {
  return {
    type: RECEIVED_APPOINTMENT_DETAILS,
    value: { appointment: data, context: { token } },
  };
};

export const VETERAN_HAS_BEEN_VALIDATED = 'VETERAN_HAS_BEEN_VALIDATED';

export const veteranHasBeenValidated = data => {
  return { type: VETERAN_HAS_BEEN_VALIDATED, value: data };
};
