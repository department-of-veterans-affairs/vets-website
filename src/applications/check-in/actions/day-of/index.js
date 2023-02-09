import { updateForm } from '../../utils/navigation/day-of';
import { findAppointment } from '../../utils/appointment';

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
  appointments,
}) => {
  const pages = updateForm(
    patientDemographicsStatus,
    isTravelReimbursementEnabled,
    appointments,
  );
  return {
    type: UPDATE_DAY_OF_CHECK_IN_FORM,
    payload: {
      pages,
    },
  };
};

export const COMPLETE_APPOINTMENT = 'COMPLETE_APPOINTMENT';

export const completeAppointment = (appointmentId, appointments) => {
  const completedAppointment = findAppointment(appointmentId, appointments);
  completedAppointment.eligibility = 'INELIGIBLE_ALREADY_CHECKED_IN';
  const appointmentIdParts = appointmentId.split('-');
  const updatedAppointments = appointments.filter(appt => {
    return (
      String(appt.appointmentIen) !== appointmentIdParts[0] &&
      String(appt.staionNo) !== appointmentIdParts[1]
    );
  });
  updatedAppointments.push(completedAppointment);
  return {
    type: COMPLETE_APPOINTMENT,
    payload: updatedAppointments,
  };
};
