import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { apiSpeedLogger } from './api-speed-tracker';

const validateToken = async token => {
  const url = '/check_in/v0/patient_check_ins/';
  const json = await apiSpeedLogger(
    apiRequest(`${environment.API_URL}${url}${token}`),
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

  const json = await apiRequest(`${environment.API_URL}${url}`, settings);
  return {
    ...json,
  };
};
export { validateToken, checkInUser };
