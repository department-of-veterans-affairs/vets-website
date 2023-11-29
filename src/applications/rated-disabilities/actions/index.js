import recordEvent from 'platform/monitoring/record-event';
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

export function getRatedDisabilities() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: '1012592956V095840',
        type: 'disability_ratings',
        attributes: {
          combinedDisabilityRating: 100,
          combinedEffectiveDate: '2019-01-01',
          legalEffectiveDate: '2018-12-31',
          individualRatings: [
            {
              decision: 'Service Connected',
              effectiveDate: '2005-01-01',
              ratingEndDate: null,
              ratingPercentage: 100,
              diagnosticTypeCode: '6100',
              diagnosticTypeName: '6100-Hearing loss',
              diagnosticText: 'Hearing Loss',
              disabilityRatingId: '1128271',
            },
            {
              decision: 'Service Connected',
              effectiveDate: '2012-05-01',
              ratingEndDate: null,
              ratingPercentage: 10,
              diagnosticTypeCode: '5260',
              diagnosticTypeName: 'Limitation of flexion, knee',
              diagnosticText: 'Allergies due to Hearing Loss',
              disabilityRatingId: '1072414',
            },
            {
              decision: 'Service Connected',
              effectiveDate: '2018-08-01',
              ratingEndDate: null,
              ratingPercentage: 0,
              diagnosticTypeCode: '8540',
              diagnosticTypeName: 'Soft tissue sarcoma (neurogenic origin)',
              diagnosticText: 'Sarcoma Soft-Tissue',
              disabilityRatingId: '1124345',
            },
            {
              decision: 'Not Service Connected',
              effectiveDate: null,
              ratingEndDate: null,
              ratingPercentage: null,
              diagnosticTypeCode: '6260',
              diagnosticTypeName: 'Tinnitus',
              diagnosticText: 'Tinnitus',
              disabilityRatingId: '1046370',
            },
            {
              decision: 'Not Service Connected',
              effectiveDate: null,
              ratingEndDate: null,
              ratingPercentage: null,
              diagnosticTypeCode: '7913',
              diagnosticTypeName: 'Diabetes mellitus',
              diagnosticText: 'Diabetes',
              disabilityRatingId: '1090859',
            },
          ],
        },
      });
    }, 2000); // simulate a delay of 2 seconds
  });
}

export function checkForDiscrepancies() {
  getData('/rated_disabilities_discrepancies');
}
