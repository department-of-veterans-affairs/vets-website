import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { makeApiCall } from '../../../utils/api';

const v2 = {
  getSession: async token => {
    const url = '/check_in/v2/sessions/';
    const json = await makeApiCall(
      apiRequest(`${environment.API_URL}${url}${token}`),
      'get-current-session',
      token,
    );
    return {
      ...json,
    };
  },
  postSession: async ({ lastName, last4, token }) => {
    const url = '/check_in/v2/sessions/';
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
    const url = '/check_in/v2/patient_check_ins/';
    const json = await makeApiCall(
      apiRequest(`${environment.API_URL}${url}${token}`),
      'get-lorota-data',
      token,
    );
    return {
      ...json,
    };
  },
  postCheckInData: async ({ uuid, appointmentIen, facilityId }) => {
    const url = '/check_in/v2/patient_check_ins/';
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      patientCheckIns: {
        uuid,
        appointmentIen,
        facilityId,
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
      uuid,
    );
    return {
      ...json,
    };
  },
};
export { v2 };
