import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { makeApiCall } from '../utils/api';

const validateToken = async token => {
  const url = '/check_in/v0/patient_check_ins/';
  const json = await makeApiCall(
    apiRequest(`${environment.API_URL}${url}${token}`),
    'lorota-token-validation',
    token,
  );
  return {
    data: json.data,
  };
};

const checkInUser = async ({ token }) => {
  const url = '/check_in/v0/patient_check_ins/';
  const headers = { 'Content-Type': 'application/json' };
  const data = {
    patientCheckIns: {
      id: token,
    },
  };
  const body = JSON.stringify(data);
  const settings = {
    headers,
    body,
    method: 'POST',
    mode: 'cors',
  };

  const json = await makeApiCall(
    apiRequest(`${environment.API_URL}${url}`, settings),
    'check-in-user',
    token,
  );
  return {
    ...json,
  };
};
export { validateToken, checkInUser };
