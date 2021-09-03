// Depricate this
export const RECEIVED_APPOINTMENT_DETAILS = 'RECEIVED_APPOINTMENT_DETAILS';

export const receivedAppointmentDetails = (data, token) => {
  return {
    type: RECEIVED_APPOINTMENT_DETAILS,
    value: { appointment: data, context: { token } },
  };
};

// replace with
export const TOKEN_WAS_VALIDATED = 'TOKEN_WAS_VALIDATED';

const organizeData = data => {
  return { ...data };
};
export const tokenWasValidated = (payload, token, scope) => {
  const data = organizeData(payload);
  return {
    type: TOKEN_WAS_VALIDATED,
    value: {
      context: { token, scope },
      appointment: data.appointment,
      facility: data.facility,
    },
  };
};
