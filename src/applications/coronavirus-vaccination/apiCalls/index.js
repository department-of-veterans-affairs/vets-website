import { apiRequest } from 'platform/utilities/api';

export const apiPostRequest = async (url, data) => {
  await apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
