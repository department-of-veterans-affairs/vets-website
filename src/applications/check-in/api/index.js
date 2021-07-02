import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const validateToken = async token => {
  const url = '/check_in/v0/patient_check_ins/';
  const json = await apiRequest(`${environment.API_URL}${url}${token}`);
  // remove :'s
  const rv = {
    isValid: true,
    data: {},
  };
  Object.keys(json[':data']).forEach(key => {
    rv.data[key.replace(':', '')] = json[':data'][key];
  });
  return rv;
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
  // remove :'s
  const rv = {
    data: {},
  };
  Object.keys(json[':data']).forEach(key => {
    rv.data[key.replace(':', '')] = json[':data'][key];
  });
  return rv;
};
export { validateToken, checkInUser };
