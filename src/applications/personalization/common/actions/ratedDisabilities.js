import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';

const SERVER_ERROR_REGEX = /^5\d{2}$/;
const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);

export const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);

async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
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
