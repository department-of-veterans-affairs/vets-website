import URLSearchParams from 'url-search-params';

const getAppointmentIdFromUrl = (window, key = 'id') => {
  if (!window) return null;
  if (!window.location) return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

const addAppointmentIdToFormId = (formId, appointmentId, questionnaireId) => {
  if (!formId) return null;
  if (!appointmentId) return formId;
  if (!questionnaireId) return formId;
  return formId.includes(appointmentId) && formId.includes(questionnaireId)
    ? formId
    : `${formId}_${appointmentId}_${questionnaireId}`;
};

const onFormEnter = appointmentId => {
  return (nextState, replace) => {
    if (appointmentId) {
      replace(`/introduction?id=${appointmentId}`);
    } else {
      // replace('/error');
      replace(`/health-care/health-questionnaires/questionnaires`);
    }
  };
};

export { getAppointmentIdFromUrl, addAppointmentIdToFormId, onFormEnter };
