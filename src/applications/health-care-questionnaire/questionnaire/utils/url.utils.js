import URLSearchParams from 'url-search-params';

const getAppointmentIdFromUrl = (window, key = 'id') => {
  if (!window) return null;
  if (!window.location) return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

const addAppointmentIdToFormId = (appointmentId, formId) => {
  if (!formId) return null;
  if (!appointmentId) return formId;
  return formId.includes(appointmentId) ? formId : `${formId}-${appointmentId}`;
};

const onFormEnter = id => {
  return (nextState, replace) => {
    if (id) {
      replace(`/introduction?id=${id}`);
    } else {
      // replace('/error');
      replace(`/health-care/health-questionnaires/questionnaires`);
    }
  };
};

export { getAppointmentIdFromUrl, addAppointmentIdToFormId, onFormEnter };
