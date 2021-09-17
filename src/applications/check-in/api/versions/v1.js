import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { makeApiCall } from '../../utils/api';

const v1 = {
  getSession: async token => {
    const url = '/check_in/v1/sessions/';
    const json = await makeApiCall(
      apiRequest(`${environment.API_URL}${url}${token}`),
      'get-current-session',
      token,
    );
    return {
      data: json.data,
    };
  },
  postSession: async ({ lastName, last4, token }) => {
    const url = '/check_in/v1/sessions/';
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      session: {
        uuid: token,
        last4: last4.trim(),
        lastName: lastName.trim(),
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
      'validating-user',
      token,
    );
    return {
      ...json,
    };
  },
  getCheckInData: async token => {
    const url = '/check_in/v1/patient_check_ins/';
    const json = await makeApiCall(
      apiRequest(`${environment.API_URL}${url}${token}`),
      'get-lorota-data',
      token,
    );
    return {
      ...json,
    };
  },
  postCheckInData: async ({ token }) => {
    const url = '/check_in/v1/patient_check_ins/';
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      patientCheckIns: {
        uuid: token,
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
  },
};
export { v1 };
