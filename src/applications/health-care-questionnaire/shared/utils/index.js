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
  getCurrentQuestionnaire,
} from './session.utils';

export {
  addAppointmentIdToFormId,
  clearAllSelectedAppointments,
  clearCurrentSession,
  clearSelectedAppointmentData,
  getAppointmentIdFromUrl,
  getCurrentAppointmentId,
  getCurrentQuestionnaire,
  getSelectedAppointmentData,
  onFormEnter,
  setCurrentAppointmentId,
  setSelectedAppointmentData,
};
