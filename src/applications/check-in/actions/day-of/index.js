export const RECEIVED_APPOINTMENT_DETAILS = 'RECEIVED_APPOINTMENT_DETAILS';

export const receivedMultipleAppointmentDetails = payload => {
  const data = { appointments: [...payload] };

  return {
    type: RECEIVED_APPOINTMENT_DETAILS,
    payload: {
      ...data,
    },
  };
};

export const APPOINTMENT_WAS_CHECKED_INTO = 'APPOINTMENT_WAS_CHECKED_INTO';

export const appointmentWasCheckedInto = appointment => {
  return {
    type: APPOINTMENT_WAS_CHECKED_INTO,
    payload: { appointment },
  };
};

export const RECEIVED_DEMOGRAPHICS_DATA = 'RECEIVED_DEMOGRAPHICS_DATA';

export const receivedDemographicsData = demographics => {
  return {
    type: RECEIVED_DEMOGRAPHICS_DATA,
    payload: { demographics },
  };
};

export const RECEIVED_NEXT_OF_KIN_DATA = 'RECEIVED_NEXT_OF_KIN_DATA';

export const receivedNextOfKinData = nextOfKin => {
  return {
    type: RECEIVED_NEXT_OF_KIN_DATA,
    payload: { nextOfKin },
  };
};
export const RECEIVED_EMERGENCY_CONTACT_DATA =
  'RECEIVED_EMERGENCY_CONTACT_DATA';

export const receivedEmergencyContact = emergencyContact => {
  return {
    type: RECEIVED_EMERGENCY_CONTACT_DATA,
    payload: { emergencyContact },
  };
};

export const SET_TOKEN_CONTEXT = 'SET_TOKEN_CONTEXT';

export const setTokenContext = (token, scope) => {
  return {
    type: SET_TOKEN_CONTEXT,
    payload: {
      context: { token, scope },
    },
  };
};
export const TRIGGER_REFRESH = 'TRIGGER_REFRESH';

export const triggerRefresh = (shouldRefresh = true) => {
  return {
    type: TRIGGER_REFRESH,
    payload: {
      context: { shouldRefresh },
    },
  };
};

export const PERMISSIONS_UPDATED = 'PERMISSIONS_UPDATED';

export const permissionsUpdated = (data, scope) => {
  const { permissions } = data;
  return {
    type: PERMISSIONS_UPDATED,
    payload: { permissions, scope },
  };
};

export const TOKEN_WAS_VALIDATED = 'TOKEN_WAS_VALIDATED';

export const tokenWasValidated = (payload, token, scope) => {
  const data = payload ? { appointments: [{ ...payload }] } : {};
  return {
    type: TOKEN_WAS_VALIDATED,
    payload: {
      context: { token, scope },
      ...data,
    },
  };
};

export const SEE_STAFF_MESSAGE_UPDATED = 'SEE_STAFF_MESSAGE_UPDATED';

export const seeStaffMessageUpdated = message => {
  return {
    type: SEE_STAFF_MESSAGE_UPDATED,
    payload: { seeStaffMessage: message },
  };
};

export const RECEIVED_DEMOGRAPHICS_STATUS = 'RECEIVED_DEMOGRAPHICS_STATUS';

export const receivedDemographicsStatus = status => {
  return {
    type: RECEIVED_DEMOGRAPHICS_STATUS,
    payload: { demographicsStatus: status },
  };
};
