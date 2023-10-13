import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { getData, isClientError, isServerError } from '../../profile/util';

function getResponseError(response) {
  if (response.errors?.length) {
    const { code, detail } = response.errors[0];
    return { code, detail };
  }
  if (response.error) {
    const { error, status } = response.error;
    return {
      code: status,
      detail: error,
    };
  }
  return null;
}

export const FETCH_RATED_DISABILITIES_SUCCESS =
  'FETCH_RATED_DISABILITIES_SUCCESS';
export const FETCH_RATED_DISABILITIES_FAILED =
  'FETCH_RATED_DISABILITIES_FAILED';

export const FETCH_TOTAL_RATING_STARTED = 'FETCH_TOTAL_RATING_STARTED';
export const FETCH_TOTAL_RATING_SUCCEEDED = 'FETCH_TOTAL_RATING_SUCCEEDED';
export const FETCH_TOTAL_RATING_FAILED = 'FETCH_TOTAL_RATING_FAILED';

export function fetchTotalDisabilityRating(recordAnalyticsEvent = recordEvent) {
  return async dispatch => {
    dispatch({
      type: FETCH_TOTAL_RATING_STARTED,
    });
    const response = await getData('/disability_compensation_form/rating_info');
    const source = response?.sourceSystem;
    const sourceString = source ? ` - ${source}` : '';
    const apiName = `GET disability rating${sourceString}`;

    const error = getResponseError(response);
    if (error) {
      const errorCode = error.code;
      if (isServerError(errorCode)) {
        recordAnalyticsEvent({
          event: `api_call`,
          'error-key': `${errorCode} internal error`,
          'api-name': apiName,
          'api-status': 'failed',
        });
      } else if (isClientError(errorCode)) {
        recordAnalyticsEvent({
          event: `api_call`,
          'error-key': `${errorCode} no combined rating found`,
          'api-name': apiName,
          'api-status': 'failed',
        });
      }
      dispatch({
        type: FETCH_TOTAL_RATING_FAILED,
        error,
      });
    } else {
      recordAnalyticsEvent({
        event: `api_call`,
        'api-name': apiName,
        'api-status': 'successful',
      });
      dispatch({
        type: FETCH_TOTAL_RATING_SUCCEEDED,
        response,
      });
    }
  };
}
