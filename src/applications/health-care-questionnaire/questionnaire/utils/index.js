import {
  getBookingNoteFromAppointment,
  getAppointTypeFromAppointment,
  getAppointmentTimeFromAppointment,
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
  getBookingNoteFromAppointment,
  getCurrentAppointmentId,
  onFormEnter,
  setCurrentAppointmentId,
};
