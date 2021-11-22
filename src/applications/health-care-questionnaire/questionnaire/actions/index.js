export const QUESTIONNAIRE_APPOINTMENT_LOADING =
  'QUESTIONNAIRE_APPOINTMENT_LOADING';

export const QUESTIONNAIRE_APPOINTMENT_LOADED =
  'QUESTIONNAIRE_APPOINTMENT_LOADED';

export const questionnaireAppointmentLoading = () => {
  return { type: QUESTIONNAIRE_APPOINTMENT_LOADING };
};

export const questionnaireAppointmentLoaded = payload => {
  return { type: QUESTIONNAIRE_APPOINTMENT_LOADED, payload };
};
