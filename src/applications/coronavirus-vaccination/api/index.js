import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';

const apiUrl = `${environment.API_URL}/covid_vaccine/v0/registration`;

export const retrievePreviouslySubmittedForm = () => apiRequest(apiUrl);

export const saveForm = formData => {
  return apiRequest(apiUrl, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
