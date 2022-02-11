import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { makeApiCallWithSentry } from '../utils';

const v2 = {
  getSession: async ({ token, checkInType }) => {
    const url = `/check_in/v2/sessions/`;
    const checkInTypeSlug = checkInType ? `?checkInType=${checkInType}` : '';
    const json = await makeApiCallWithSentry(
      apiRequest(`${environment.API_URL}${url}${token}${checkInTypeSlug}`),
      'get-current-session',
      token,
    );
    return {
      ...json,
    };
  },
  postSession: async ({ lastName, last4, token, checkInType = '' }) => {
    const url = '/check_in/v2/sessions/';
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      session: {
        uuid: token,
        last4: last4.trim(),
        lastName: lastName.trim(),
        checkInType,
      },
    };
    const body = JSON.stringify(data);
    const settings = {
      headers,
      body,
      method: 'POST',
      mode: 'cors',
    };

    const json = await makeApiCallWithSentry(
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
    const json = await makeApiCallWithSentry(
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

    const json = await makeApiCallWithSentry(
      apiRequest(`${environment.API_URL}${url}`, settings),
      'check-in-user',
      uuid,
    );
    return {
      ...json,
    };
  },
  getPreCheckInData: async token => {
    const url = '/check_in/v2/pre_check_ins/';
    const json = await makeApiCallWithSentry(
      apiRequest(`${environment.API_URL}${url}${token}?checkInType=preCheckIn`),
      'get-lorota-data',
      token,
    );
    return {
      ...json,
    };
  },
  postPreCheckInData: async ({
    uuid,
    demographicsUpToDate,
    nextOfKinUpToDate,
    emergencyContactUpToDate,
    checkInType = 'preCheckIn',
  }) => {
    const url = '/check_in/v2/pre_check_ins/';
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      preCheckIn: {
        uuid,
        demographicsUpToDate,
        nextOfKinUpToDate,
        emergencyContactUpToDate,
        checkInType,
      },
    };
    const body = JSON.stringify(data);
    const settings = {
      headers,
      body,
      method: 'POST',
      mode: 'cors',
    };

    const json = await makeApiCallWithSentry(
      apiRequest(`${environment.API_URL}${url}`, settings),
      'pre-check-in-user',
      uuid,
    );
    return {
      ...json,
    };
  },
};
export { v2 };
