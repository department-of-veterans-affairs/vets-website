// phased out until multiple appointments
export const RECEIVED_APPOINTMENT_DETAILS = 'RECEIVED_APPOINTMENT_DETAILS';

export const receivedAppointmentDetails = (data, token) => {
  return {
    type: RECEIVED_APPOINTMENT_DETAILS,
    value: { appointment: data, context: { token } },
  };
};

export const TOKEN_WAS_VALIDATED = 'TOKEN_WAS_VALIDATED';

const organizeData = data => {
  return {
    appointments: [{ ...data }],
  };
};
export const tokenWasValidated = (payload, token, scope) => {
  const data = organizeData(payload);
  return {
    type: TOKEN_WAS_VALIDATED,
    data: {
      context: { token, scope },
      ...data,
    },
  };
};
