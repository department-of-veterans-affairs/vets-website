import URLSearchParams from 'url-search-params';

const getAppointmentIdFromUrl = (window, key = 'id') => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

const addAppointmentIdToFormId = (appointmentId, formId) => {
  return formId.includes(appointmentId) ? formId : `${formId}-${appointmentId}`;
};

export { getAppointmentIdFromUrl, addAppointmentIdToFormId };
