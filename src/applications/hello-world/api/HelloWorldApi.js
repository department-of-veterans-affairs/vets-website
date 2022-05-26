import { apiRequest } from 'platform/utilities/api';

export const submitForm = form => {
  const optionalSettings = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: form,
    apiVersion: '/test',
  };
  return apiRequest('/message', optionalSettings);
};

export const getMessage = async () => {
  const optionalSettings = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    apiVersion: 'test',
  };
  try {
    return await apiRequest('/message', optionalSettings);
  } catch (e) {
    return null;
  }
};
