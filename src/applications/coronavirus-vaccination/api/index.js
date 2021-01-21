import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';

const apiUrl = `${environment.API_URL}/covid_vaccine/v0/registration`;
const unsubscribeUrl = `${
  environment.API_URL
}/covid_vaccine/v0/registration/opt_out`;

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

export const unsubscribe = sid => {
  return apiRequest(unsubscribeUrl, {
    method: 'PUT',
    body: JSON.stringify({ sid }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
