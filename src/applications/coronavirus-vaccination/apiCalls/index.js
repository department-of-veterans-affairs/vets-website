import { apiRequest } from 'platform/utilities/api';

export const apiPostRequest = async (url, data) => {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const apiGetRequest = async url => {
  return apiRequest(url);
};
