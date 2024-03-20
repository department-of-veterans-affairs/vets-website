import * as Sentry from '@sentry/browser';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  apiRequest,
  replacementFunctions as dataUtils,
} from '@department-of-veterans-affairs/platform-utilities/exports';

import { roundToNearest } from '../utils/helpers';
import {
  getErrorStatus,
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
  FETCH_APPEALS_ERROR,
  FETCH_APPEALS_PENDING,
} from '../utils/appeals-helpers';
import {
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_SUCCESS,
  FETCH_CLAIMS_ERROR,
} from '../utils/claims-helpers';

// -------------------- v2 and v1 -------------
export const FETCH_APPEALS_SUCCESS = 'FETCH_APPEALS_SUCCESS';
// -------------------- v1 --------------------
export const FETCH_CLAIMS = 'FETCH_CLAIMS';
export const FETCH_APPEALS = 'FETCH_APPEALS';
export const FETCH_STEM_CLAIMS_PENDING = 'FETCH_STEM_CLAIMS_PENDING';
export const FETCH_STEM_CLAIMS_SUCCESS = 'FETCH_STEM_CLAIMS_SUCCESS';
export const FETCH_STEM_CLAIMS_ERROR = 'FETCH_STEM_CLAIMS_ERROR';
export const FILTER_CLAIMS = 'FILTER_CLAIMS';
export const SORT_CLAIMS = 'SORT_CLAIMS';

const { get } = dataUtils;

export function fetchAppealsSuccess(response) {
  const appeals = response.data;
  return {
    type: FETCH_APPEALS_SUCCESS,
    appeals,
  };
}

export function getAppealsV2() {
  return dispatch => {
    dispatch({ type: FETCH_APPEALS_PENDING });
    return apiRequest('/appeals')
      .then(appeals => dispatch(fetchAppealsSuccess(appeals)))
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
          Sentry.captureException(
            `va_dashboard_appeals_v2_err_get_appeals ${status}`,
          );
        });
        return dispatch(action);
      });
  };
}

export function fetchClaimsSuccess(response) {
  return {
    type: FETCH_CLAIMS_SUCCESS,
    claims: response.data,
  };
}

export function getSyncStatus(claimsAsyncResponse) {
  return get('meta.syncStatus', claimsAsyncResponse, null);
}

const recordClaimsAPIEvent = ({
  startTime,
  success,
  error,
  apiName = 'GET Lighthouse claims /v0/benefits_claims',
}) => {
  const event = {
    event: 'api_call',
    'api-name': apiName,
    'api-status': success ? 'successful' : 'failed',
  };
  if (error) {
    event['error-key'] = error;
  }
  if (startTime) {
    const apiLatencyMs = roundToNearest({
      interval: 5000,
      value: Date.now() - startTime,
    });
    event['api-latency-ms'] = apiLatencyMs;
  }
  recordEvent(event);
  if (event['error-key']) {
    recordEvent({
      'error-key': undefined,
    });
  }
};

export function getClaims() {
  const startTimestampMs = Date.now();

  return dispatch => {
    dispatch({ type: FETCH_CLAIMS_PENDING });

    return apiRequest('/benefits_claims')
      .then(response => {
        recordClaimsAPIEvent({
          startTime: startTimestampMs,
          success: true,
        });
        dispatch(fetchClaimsSuccess(response));
      })
      .catch(response => {
        const errorCode = getErrorStatus(response);
        Sentry.withScope(scope => {
          scope.setFingerprint(['{{default}}', errorCode]);
          Sentry.captureException(
            `va-dashboard_claims_v2_err_get_lighthouse_claims ${errorCode}`,
          );
        });
        recordClaimsAPIEvent({
          startTime: startTimestampMs,
          success: false,
          error: errorCode,
        });
        return dispatch({ type: FETCH_CLAIMS_ERROR });
      });
  };
}
