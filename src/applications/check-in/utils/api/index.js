import { createApiEvent } from '../analytics';
import recordEvent from 'platform/monitoring/record-event';

/**
 * @param {Promise} request
 * @param {string} [eventName]
 * @param {string} [token]
 */
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
    const error = data?.error || data?.errors;
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

export { makeApiCall };
