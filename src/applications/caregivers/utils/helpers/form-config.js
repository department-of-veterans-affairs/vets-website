import recordEvent from 'platform/monitoring/record-event';
import { MED_CENTERS_BY_STATE } from '../constants';

export const createPayload = (file, formId, password) => {
  const payload = new FormData();
  payload.append('attachment[file_data]', file);
  payload.append('form_id', formId);
  payload.append('name', file.name);

  // password for encrypted PDFs
  if (password) {
    payload.append('attachment[password]', password);
  }

  return payload;
};

export const parseResponse = (fileInfo, file) => {
  recordEvent({
    'caregivers-poa-document-guid': fileInfo.data.attributes.guid,
    'caregivers-poa-document-confirmation-code': fileInfo.data.id,
  });

  return {
    guid: fileInfo.data.attributes.guid,
    confirmationCode: fileInfo.data.id,
    name: file.name,
  };
};

export const setPlannedClinics = formData => {
  const state = formData['view:plannedClinicState'];
  return { enum: MED_CENTERS_BY_STATE[state] || [] };
};
