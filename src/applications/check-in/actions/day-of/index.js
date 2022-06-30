import { updateForm } from '../../utils/navigation/day-of';

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

export const TRIGGER_REFRESH = 'TRIGGER_REFRESH';

export const triggerRefresh = (shouldRefresh = true) => {
  return {
    type: TRIGGER_REFRESH,
    payload: {
      context: { shouldRefresh },
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

export const UPDATE_DAY_OF_CHECK_IN_FORM = 'UPDATE_DAY_OF_CHECK_IN_FORM';

export const updateFormAction = ({ patientDemographicsStatus }) => {
  const pages = updateForm(patientDemographicsStatus);
  return {
    type: UPDATE_DAY_OF_CHECK_IN_FORM,
    payload: {
      pages,
    },
  };
};
