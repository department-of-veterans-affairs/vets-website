import { apiRequest } from 'platform/utilities/api';

export const apiGetRequest = async url => {
  return apiRequest(url);
};

export const apiPostRequest = async (url, data) => {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const apiPatchRequest = async (url, data) => {
  return apiRequest(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
