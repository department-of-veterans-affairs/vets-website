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
  getCurrentAppointmentId,
  setCurrentAppointmentId,
  clearCurrentSession,
} from './session.utils';

export {
  addAppointmentIdToFormId,
  clearCurrentSession,
  getAppointTypeFromAppointment,
  getAppointmentTimeFromAppointment,
  getAppointmentIdFromUrl,
  getAppointmentTypeFromClinic,
  getBookingNoteFromAppointment,
  getClinicFromAppointment,
  getCurrentAppointmentId,
  getFacilityFromAppointment,
  onFormEnter,
  setCurrentAppointmentId,
};
