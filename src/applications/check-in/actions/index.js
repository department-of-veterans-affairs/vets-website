const organizeData = data => {
  return {
    appointments: [{ ...data }],
  };
};

export const RECEIVED_APPOINTMENT_DETAILS = 'RECEIVED_APPOINTMENT_DETAILS';

export const receivedAppointmentDetails = payload => {
  const data = organizeData(payload);

  return {
    type: RECEIVED_APPOINTMENT_DETAILS,
    data: {
      ...data,
    },
  };
};

export const PERMISSIONS_UPDATED = 'PERMISSIONS_UPDATED';

export const permissionsUpdated = (data, scope) => {
  const { permissions } = data;
  return {
    type: PERMISSIONS_UPDATED,
    value: { permissions, scope },
  };
};

export const TOKEN_WAS_VALIDATED = 'TOKEN_WAS_VALIDATED';

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
