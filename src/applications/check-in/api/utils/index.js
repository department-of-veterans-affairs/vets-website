// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  createApiEvent,
  captureError,
  ERROR_SOURCES,
} from '../../utils/analytics';

const captureErrorToSentry = (error, details) => {
  captureError(error, details);
};

/**
 * @param {Promise} request
 * @param {string} [eventName]
 * @param {string} [token]
 * @param {function} [logEvent] used to log failed api calls
 */
const makeApiCall = async (
  request,
  eventName,
  token,
  logEvent = () => {},
  sendCode,
) => {
  // log call started
  // console.trace('not sure');
  recordEvent(createApiEvent(eventName, 'started'));
  // start the timer
  const startTime = new Date();
  // do the call
  const FAILED = 'failed';
  const SUCCESS = 'success';
  try {
    const json = await request;
    const endTime = new Date();
    const timeDiff = endTime.getTime() - startTime.getTime();

    const { data } = json;
    const error = data?.error || data?.errors;
    const code = sendCode ? ` - ${data?.code}` : '';
    const status = error ? `${FAILED}${code}` : SUCCESS;

    const event = createApiEvent(eventName, status, timeDiff, token, error);
    if (status === FAILED) {
      logEvent(
        {
          source: ERROR_SOURCES.API,
          err: error,
        },
        {
          token,
          eventName,
          json,
        },
      );
    }
    recordEvent(event);
    return json;
  } catch (error) {
    const event = createApiEvent(eventName, FAILED, null, token, error);
    recordEvent(event);
    logEvent(error, { token });
    throw error;
  }
};

const makeApiCallWithSentry = async (
  request,
  eventName,
  token,
  sendCode = false,
) => {
  return makeApiCall(request, eventName, token, captureErrorToSentry, sendCode);
};
export { makeApiCall, makeApiCallWithSentry };
