import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { createApiEvent } from '../utils/analytics';
import recordEvent from 'platform/monitoring/record-event';

const makeApiCall = async (request, eventName, token) => {
  // log call started
  recordEvent(createApiEvent(eventName, 'started'));
  // start the timer
  const startTime = new Date();
  // do the call

  try {
    const json = await request;
    const endTime = new Date();
    const timeDiff = endTime.getTime() - startTime.getTime();

    const { data } = json;
    const error = data.error || data.errors;
    const status = error ? 'failed' : 'success';
    const event = createApiEvent(eventName, status, timeDiff, token, error);
    recordEvent(event);
    return json;
  } catch (error) {
    const event = createApiEvent(eventName, status, null, token, error);
    recordEvent(event);
    throw error;
  }
};

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

  const json = await apiRequest(`${environment.API_URL}${url}`, settings);
  return {
    ...json,
  };
};
export { validateToken, checkInUser, makeApiCall };
