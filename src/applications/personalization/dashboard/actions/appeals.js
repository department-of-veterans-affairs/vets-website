import * as Sentry from '@sentry/browser';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';

import { roundToNearest } from '../utils/helpers';
import { getErrorStatus } from '../utils/appeals-helpers';

export const FETCH_APPEALS = 'FETCH_APPEALS';
export const FETCH_APPEALS_PENDING = 'FETCH_APPEALS_PENDING';
export const FETCH_APPEALS_SUCCESS = 'FETCH_APPEALS_SUCCESS';
export const FETCH_APPEALS_ERROR = 'FETCH_APPEALS_ERROR';
export const VALIDATION_ERROR = 'VALIDATION_ERROR';
export const USER_FORBIDDEN_ERROR = 'USER_FORBIDDEN_ERROR';
export const RECORD_NOT_FOUND_ERROR = 'RECORD_NOT_FOUND_ERROR';
export const BACKEND_SERVICE_ERROR = 'BACKEND_SERVICE_ERROR';

export function fetchAppealsSuccess(response) {
  const appeals = response.data;
  return {
    type: FETCH_APPEALS_SUCCESS,
    appeals,
  };
}

const recordAppealsAPIEvent = ({
  startTime,
  success,
  errorStatus,
  errorTitle,
  apiName = 'GET appeals /v0/appeals',
}) => {
  const event = {
    event: 'api_call',
    'api-name': apiName,
    'api-status': success ? 'successful' : 'failed',
  };
  if (errorStatus && errorTitle) {
    event[
      'error-key'
    ] = `my_va_appeals_api_failure_${errorStatus}_${errorTitle}`;
  }
  if (startTime) {
    const apiLatencyMs = roundToNearest({
      interval: 5000,
      value: Date.now() - startTime,
    });
    event['api-latency-ms'] = apiLatencyMs;
  }
  recordEvent(event);
};

export function getAppeals() {
  const startTimestampMs = Date.now();

  return dispatch => {
    dispatch({ type: FETCH_APPEALS_PENDING });

    return apiRequest('/appeals')
      .then(appeals => {
        recordAppealsAPIEvent({
          startTime: startTimestampMs,
          success: true,
        });
        dispatch(fetchAppealsSuccess(appeals));
      })
      .catch(error => {
        const status = getErrorStatus(error);
        const action = { type: '' };
        switch (status) {
          case '403':
            action.type = USER_FORBIDDEN_ERROR;
            break;
          case '404':
            action.type = RECORD_NOT_FOUND_ERROR;
            break;
          case '422':
            action.type = VALIDATION_ERROR;
            break;
          case '502':
            action.type = BACKEND_SERVICE_ERROR;
            break;
          default:
            action.type = FETCH_APPEALS_ERROR;
            break;
        }
        Sentry.withScope(scope => {
          scope.setFingerprint(['{{default}}', status]);
          Sentry.captureException(`my_va_appeals_err_get_appeals ${status}`);
        });
        recordAppealsAPIEvent({
          startTime: startTimestampMs,
          success: false,
          errorStatus: `${status}`,
          errorTitle: `${action.type}`,
        });
        return dispatch(action);
      });
  };
}
