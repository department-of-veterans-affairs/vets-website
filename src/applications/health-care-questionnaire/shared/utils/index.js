import {
  getBookingNoteFromAppointment,
  getAppointTypeFromAppointment,
  getAppointmentTimeFromAppointment,
  getAppointmentTypeFromClinic,
  getClinicFromAppointment,
  getFacilityFromAppointment,
} from './appointment.utils';

import {
  getAppointmentIdFromUrl,
  addAppointmentIdToFormId,
  onFormEnter,
} from './url.utils';

import {
  clearCurrentSession,
  getCurrentAppointmentId,
  setCurrentAppointmentId,
  setSelectedAppointmentData,
  getSelectedAppointmentData,
  clearSelectedAppointmentData,
  clearAllSelectedAppointments,
} from './session.utils';

export {
  addAppointmentIdToFormId,
  clearAllSelectedAppointments,
  clearCurrentSession,
  clearSelectedAppointmentData,
  getAppointTypeFromAppointment,
  getAppointmentTimeFromAppointment,
  getAppointmentIdFromUrl,
  getAppointmentTypeFromClinic,
  getBookingNoteFromAppointment,
  getClinicFromAppointment,
  getCurrentAppointmentId,
  getFacilityFromAppointment,
  getSelectedAppointmentData,
  onFormEnter,
  setCurrentAppointmentId,
  setSelectedAppointmentData,
};
