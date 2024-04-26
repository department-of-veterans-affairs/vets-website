import * as Sentry from '@sentry/browser';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';

import { roundToNearest } from '../utils/helpers';
import { getErrorStatus } from '../utils/appeals-helpers';

export const FETCH_CLAIMS_PENDING = 'FETCH_CLAIMS_PENDING';
export const FETCH_CLAIMS_SUCCESS = 'FETCH_CLAIMS_SUCCESS';
export const FETCH_CLAIMS_ERROR = 'FETCH_CLAIMS_ERROR';
export const FETCH_CLAIMS = 'FETCH_CLAIMS';
export const FETCH_STEM_CLAIMS_PENDING = 'FETCH_STEM_CLAIMS_PENDING';
export const FETCH_STEM_CLAIMS_SUCCESS = 'FETCH_STEM_CLAIMS_SUCCESS';
export const FETCH_STEM_CLAIMS_ERROR = 'FETCH_STEM_CLAIMS_ERROR';
export const FILTER_CLAIMS = 'FILTER_CLAIMS';
export const SORT_CLAIMS = 'SORT_CLAIMS';

export function fetchClaimsSuccess(response) {
  return {
    type: FETCH_CLAIMS_SUCCESS,
    claims: response.data,
  };
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
    event['error-key'] = `my_va_claims_api_failure_${error}`;
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
            `my_va_claims_err_get_lighthouse_claims ${errorCode}`,
          );
        });
        recordClaimsAPIEvent({
          startTime: startTimestampMs,
          success: false,
          error: `${errorCode}`,
        });
        return dispatch({ type: FETCH_CLAIMS_ERROR });
      });
  };
}
