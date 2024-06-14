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

export const updateFormAction = ({
  patientDemographicsStatus,
  isTravelReimbursementEnabled,
  travelPaySent,
}) => {
  const pages = updateForm(
    patientDemographicsStatus,
    isTravelReimbursementEnabled,
    travelPaySent,
  );
  return {
    type: UPDATE_DAY_OF_CHECK_IN_FORM,
    payload: {
      pages,
    },
  };
};

export const ADDITIONAL_CONTEXT = 'ADDITIONAL_CONTEXT';

export const additionalContext = newContext => {
  return {
    type: ADDITIONAL_CONTEXT,
    payload: {
      context: newContext,
    },
  };
};
