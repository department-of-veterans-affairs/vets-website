import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { getData, isServerError, isClientError } from '../util';

export const FETCH_RATED_DISABILITIES_SUCCESS =
  'FETCH_RATED_DISABILITIES_SUCCESS';
export const FETCH_RATED_DISABILITIES_FAILED =
  'FETCH_RATED_DISABILITIES_FAILED';

export const FETCH_TOTAL_RATING_STARTED = 'FETCH_TOTAL_RATING_STARTED';
export const FETCH_TOTAL_RATING_SUCCEEDED = 'FETCH_TOTAL_RATING_SUCCEEDED';
export const FETCH_TOTAL_RATING_FAILED = 'FETCH_TOTAL_RATING_FAILED';

export function fetchRatedDisabilities() {
  return async dispatch => {
    const response = await getData(
      '/disability_compensation_form/rated_disabilities',
    );

    if (response.errors) {
      const errorCode = response.errors[0].code;
      if (isServerError(errorCode)) {
        recordEvent({
          event: `api_call`,
          'error-key': `${errorCode} server error`,
          'api-name': 'GET rated disabilities',
          'api-status': 'failed',
        });
      } else if (isClientError(errorCode)) {
        recordEvent({
          event: `api_call`,
          'error-key': `${errorCode} client error`,
          'api-name': 'GET rated disabilities',
          'api-status': 'failed',
        });
      }
      dispatch({
        type: FETCH_RATED_DISABILITIES_FAILED,
        response,
      });
    } else {
      recordEvent({
        event: `api_call`,
        'api-name': 'GET rated disabilities',
        'api-status': 'successful',
      });
      dispatch({
        type: FETCH_RATED_DISABILITIES_SUCCESS,
        response,
      });
    }
  };
}

function getResponseError(response) {
  if (response.errors?.length) {
    const { code, detail } = response.errors[0];
    return { code, detail };
  }
  if (response.error) {
    return {
      code: response.status,
      detail: response.error,
    };
  }
  return null;
}

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

export function checkForDiscrepancies() {
  getData('/rated_disabilities_discrepancies');
}

export function getRatedDisabilities() {
  return getData('/rated_disabilities');
}
