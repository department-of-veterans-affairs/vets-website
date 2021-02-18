import { getAppointmentIdFromUrl } from './url.utils';

const sessionNameSpace = 'health.care.questionnaire.';

const SESSION_STORAGE_KEYS = Object.freeze({
  CURRENT_HEALTH_QUESTIONNAIRE: `${sessionNameSpace}currentHealthQuestionnaire`,
  SELECTED_APPOINTMENT_DATA: `${sessionNameSpace}selectedAppointmentData`,
});

const getCurrentAppointmentId = window => {
  if (!window) return null;
  const { CURRENT_HEALTH_QUESTIONNAIRE } = SESSION_STORAGE_KEYS;
  const { sessionStorage } = window;
  // check url
  const urlId = getAppointmentIdFromUrl(window);

  // if a url id
  if (urlId) {
    return urlId;
  } else {
    // if no url id,
    const data = sessionStorage.getItem(CURRENT_HEALTH_QUESTIONNAIRE) ?? '{}';
    const parsed = JSON.parse(data);
    const sId = parsed?.appointmentId;
    // check session
    if (!sId) {
      // if no url and no session, trigger redirect.
      return null;
    }
    return sId;
  }
};

const setCurrentAppointmentId = (window, id) => {
  const { sessionStorage } = window;
  const { CURRENT_HEALTH_QUESTIONNAIRE } = SESSION_STORAGE_KEYS;
  // store in session
  const data = {
    appointmentId: id,
  };
  sessionStorage.setItem(CURRENT_HEALTH_QUESTIONNAIRE, JSON.stringify(data));
};

const clearCurrentSession = window => {
  const { sessionStorage } = window;
  const { CURRENT_HEALTH_QUESTIONNAIRE } = SESSION_STORAGE_KEYS;

  sessionStorage.removeItem(CURRENT_HEALTH_QUESTIONNAIRE);
};

const setSelectedAppointmentData = (window, appointment) => {
  const { sessionStorage } = window;
  const { SELECTED_APPOINTMENT_DATA } = SESSION_STORAGE_KEYS;
  // store in session
  const id = appointment.id;
  const key = `${SELECTED_APPOINTMENT_DATA}.${id}`;
  const data = {
    appointment,
  };
  sessionStorage.setItem(key, JSON.stringify(data));
};

const getSelectedAppointmentData = (window, id) => {
  if (!window) return null;
  if (!id) return null;
  const { sessionStorage } = window;
  const { SELECTED_APPOINTMENT_DATA } = SESSION_STORAGE_KEYS;

  const key = `${SELECTED_APPOINTMENT_DATA}.${id}`;

  const data = sessionStorage.getItem(key) ?? '{}';
  const parsed = JSON.parse(data);
  const { appointment } = parsed;
  if (appointment) {
    return appointment;
  } else {
    return null;
  }
};

const clearSelectedAppointmentData = (window, id) => {
  const { sessionStorage } = window;
  const { SELECTED_APPOINTMENT_DATA } = SESSION_STORAGE_KEYS;

  const key = `${SELECTED_APPOINTMENT_DATA}.${id}`;
  sessionStorage.removeItem(key);
};

export {
  clearCurrentSession,
  getCurrentAppointmentId,
  setCurrentAppointmentId,
  setSelectedAppointmentData,
  getSelectedAppointmentData,
  clearSelectedAppointmentData,
};
