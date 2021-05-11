import environment from 'platform/utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';
import { apiRequest } from 'platform/utilities/api';

const apiUrl = `${environment.API_URL}/covid_vaccine/v0/registration`;
const unsubscribeUrl = `${
  environment.API_URL
}/covid_vaccine/v0/registration/opt_out`;

export const retrievePreviouslySubmittedForm = () => apiRequest(apiUrl);

export const saveForm = formData => {
  const csrfTokenStored = localStorage.getItem('csrfToken');
  return apiRequest(apiUrl, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfTokenStored,
    },
  });
};

export const unsubscribe = sid => {
  const csrfTokenStored = localStorage.getItem('csrfToken');
  return apiRequest(unsubscribeUrl, {
    method: 'PUT',
    body: JSON.stringify({ sid }),
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfTokenStored,
    },
  });
};
