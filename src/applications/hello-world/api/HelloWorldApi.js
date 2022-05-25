import { apiRequest } from 'platform/utilities/api';

export const submitForm = form => {
  const optionalSettings = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: form,
  };
  return apiRequest('/test/message/', optionalSettings);
};

export default submitForm;
