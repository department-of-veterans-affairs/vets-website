import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const validateToken = async token => {
  const url = '/v0/patient_check_in/';
  return apiRequest(`${environment.API_URL}${url}${token}`);
};

const checkInUser = data => {
  const url = '/v0/patient_check_in/';
  const headers = { 'Content-Type': 'application/json' };

  const body = JSON.stringify(data);
  const settings = {
    headers,
    body,
    method: 'POST',
    mode: 'cors',
  };

  return apiRequest(`${environment.API_URL}${url}`, settings);
};

export { validateToken, checkInUser };
