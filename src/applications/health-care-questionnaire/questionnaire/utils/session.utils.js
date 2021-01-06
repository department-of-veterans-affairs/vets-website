import { getAppointmentIdFromUrl } from './url.utils';

const SESSION_STORAGE_KEYS = Object.freeze({
  CURRENT_HEALTH_QUESTIONNAIRE: 'currentHealthQuestionnaire',
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

export { getCurrentAppointmentId, setCurrentAppointmentId };
