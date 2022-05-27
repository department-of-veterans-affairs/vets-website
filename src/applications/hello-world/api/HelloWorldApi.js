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

export const getMessage2 = async () => {
  const optionalSettings = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    apiVersion: 'test',
  };

  return await apiRequest('http://localhost:3000/test/message', optionalSettings);
};

export const helloWorld = () => {
  return {"hello": "world"};
};