import * as Sentry from '@sentry/browser';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  apiRequest,
  replacementFunctions as dataUtils,
} from '@department-of-veterans-affairs/platform-utilities/exports';

import {
  getErrorStatus,
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
  FETCH_APPEALS_ERROR,
  FETCH_APPEALS_PENDING,
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_SUCCESS,
  FETCH_CLAIMS_ERROR,
  UNKNOWN_STATUS,
} from '../utils/appeals-v2-helpers';
import { roundToNearest } from '../utils/claims-helpers';

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

export function pollRequest(options) {
  const {
    onError,
    onSuccess,
    pollingExpiration,
    pollingInterval,
    request = apiRequest,
    shouldFail,
    shouldSucceed,
    target,
  } = options;
  return request(
    target,
    null,
    response => {
      if (shouldSucceed(response)) {
        onSuccess(response);
        return;
      }

      if (shouldFail(response)) {
        onError(response);
        return;
      }

      if (pollingExpiration && Date.now() > pollingExpiration) {
        onError(null);
        return;
      }

      setTimeout(pollRequest, pollingInterval, options);
    },
    error => onError(error),
  );
}

export function getSyncStatus(claimsAsyncResponse) {
  return get('meta.syncStatus', claimsAsyncResponse, null);
}

const recordClaimsAPIEvent = ({
  startTime,
  success,
  error,
  apiName = 'GET EVSS claims /v0/evss_claims_async',
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

const recordLighthouseClaimsAPIEvent = ({ startTime, success, error }) => {
  recordClaimsAPIEvent({
    startTime,
    success,
    error,
    apiName: 'GET Lighthouse claims /v0/benefits_claims',
  });
};

export function getClaimsV2(options = {}) {
  // Throw an error if an unsupported value is on the `options` object
  const recognizedOptions = ['poll', 'pollingExpiration'];
  Object.keys(options).forEach(option => {
    if (!recognizedOptions.includes(option)) {
      throw new TypeError(
        `Unrecognized option "${option}" passed to "getClaimsV2"\nOnly the following options are supported:\n${recognizedOptions.join(
          '\n',
        )}`,
      );
    }
  });
  const { poll = pollRequest, pollingExpiration } = options;
  const startTimestampMs = Date.now();
  return dispatch => {
    dispatch({ type: FETCH_CLAIMS_PENDING });

    return poll({
      onError: response => {
        const errorCode = getErrorStatus(response);
        if (errorCode && errorCode !== UNKNOWN_STATUS) {
          Sentry.withScope(scope => {
            scope.setFingerprint(['{{default}}', errorCode]);
            Sentry.captureException(
              `va-dashboard_claims_v2_err_get_claims ${errorCode}`,
            );
          });
        }
        // This onError callback will be called with a null response arg when
        // the API takes too long to return data
        if (response === null) {
          recordClaimsAPIEvent({
            startTime: startTimestampMs,
            success: false,
            error: '504 Timed out - API took too long',
          });
        } else {
          recordClaimsAPIEvent({
            startTime: startTimestampMs,
            success: false,
            error: errorCode,
          });
        }

        return dispatch({ type: FETCH_CLAIMS_ERROR });
      },
      onSuccess: response => {
        recordClaimsAPIEvent({
          startTime: startTimestampMs,
          success: true,
        });
        dispatch(fetchClaimsSuccess(response));
      },
      pollingExpiration,
      pollingInterval: window.VetsGov.pollTimeout || 5000,
      shouldFail: response => getSyncStatus(response) === 'FAILED',
      shouldSucceed: response => getSyncStatus(response) === 'SUCCESS',
      target: '/evss_claims_async',
    });
  };
}

export function getLighthouseClaims() {
  const startTimestampMs = Date.now();

  return dispatch => {
    dispatch({ type: FETCH_CLAIMS_PENDING });

    return apiRequest('/benefits_claims')
      .then(response => {
        recordLighthouseClaimsAPIEvent({
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
        recordLighthouseClaimsAPIEvent({
          startTime: startTimestampMs,
          success: false,
          error: errorCode,
        });
        return dispatch({ type: FETCH_CLAIMS_ERROR });
      });
  };
}
