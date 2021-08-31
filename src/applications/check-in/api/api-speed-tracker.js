import recordEvent from 'platform/monitoring/record-event';
import { createApiEvent } from '../utils/analytics';

const apiSpeedLogger = async (request, token) => {
  const startTime = new Date();
  const response = await request;
  const endTime = new Date();
  const timeDiff = endTime.getTime() - startTime.getTime();
  recordEvent({
    event: 'api_call',
    'api-name': 'api_speed_test',
    'api-status': timeDiff,
    data: token,
  });
  return response;
};

const makeApiCall = async (apiRequest, eventName, success, token) => {
  // log call started
  recordEvent(createApiEvent(eventName, 'started'));
  // start the timer
  const startTime = new Date();
  // do the call
  const json = await apiRequest;
  const endTime = new Date();
  const timeDiff = endTime.getTime() - startTime.getTime();

  const { data } = json;
  if (data.error || data.errors) {
    // if the call is failure,
    // log call failure with time
    const error = data.error || data.errors;
    recordEvent(createApiEvent(eventName, 'failed', timeDiff, token, error));

    // run the error handler
    error(json);
  } else {
    // if the call is success,
    // log call success with time
    recordEvent(createApiEvent(eventName, 'success', timeDiff, token));

    // return success handler
    success(json);
  }
};

export { apiSpeedLogger, makeApiCall };
