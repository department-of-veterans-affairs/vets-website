import appendQuery from 'append-query';
import set from 'lodash/set';

import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';

import { captureError, createApiEvent, ERROR_SOURCES } from '../util/analytics';

import {
  VAP_SERVICE_TRANSACTION_REQUESTED,
  VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
  VAP_SERVICE_TRANSACTION_REQUEST_FAILED,
  clearTransaction,
} from '.';

export const FETCH_SCHEDULING_PREFERENCES = 'FETCH_SCHEDULING_PREFERENCES';
export const FETCH_SCHEDULING_PREFERENCES_SUCCESS =
  'FETCH_SCHEDULING_PREFERENCES_SUCCESS';
export const FETCH_SCHEDULING_PREFERENCES_FAILED =
  'FETCH_SCHEDULING_PREFERENCES_FAILED';

export const UPDATE_SCHEDULING_PREFERENCES_FIELD =
  'UPDATE_SCHEDULING_PREFERENCES_FIELD';

const handleServerErrorResponse = response => {
  if (response?.errors) {
    const error = new Error('There was an api error');
    error.errors = response?.errors;
    error.source = ERROR_SOURCES.API;
    throw error;
  }
};

const captureAndRecordError = ({
  error,
  apiEventName,
  analyticsSectionName = 'unknown-profile-section',
  recordAnalyticsEvent,
}) => {
  const [firstError = {}] = error.errors ?? [];
  const {
    code = 'code-unknown',
    title = 'title-unknown',
    detail = 'detail-unknown',
    status = 'status-unknown',
  } = firstError;

  const errorKey = `${analyticsSectionName}-${code}-${title}-${detail}`;

  recordAnalyticsEvent(
    createApiEvent({
      name: apiEventName,
      status: 'failed',
      errorKey,
    }),
  );

  captureError(error, { eventName: apiEventName, code, title, detail, status });
};

export function fetchSchedulingPreferences(
  forceCacheClear = false,
  recordAnalyticsEvent = recordEvent,
) {
  return async dispatch => {
    dispatch({ type: FETCH_SCHEDULING_PREFERENCES });

    const baseUrl = '/profile/scheduling_preferences';

    const apiEventName = `GET ${baseUrl}`;

    const url = forceCacheClear
      ? appendQuery(baseUrl, { now: new Date().getTime() })
      : baseUrl;

    try {
      recordAnalyticsEvent(
        createApiEvent({
          name: apiEventName,
          status: 'started',
        }),
      );

      const response = await apiRequest(url);

      handleServerErrorResponse(response);

      const schedulingPreferencesData = response.data.attributes;

      recordAnalyticsEvent(
        createApiEvent({
          name: apiEventName,
          status: 'successful',
        }),
      );

      dispatch({
        type: FETCH_SCHEDULING_PREFERENCES_SUCCESS,
        schedulingPreferences: schedulingPreferencesData,
      });
    } catch (error) {
      captureAndRecordError({ error, apiEventName, recordAnalyticsEvent });
      dispatch({
        type: FETCH_SCHEDULING_PREFERENCES_FAILED,
        schedulingPreferences: {
          error: { message: error.message || 'no error message provided' },
        },
      });
    }
  };
}

// since the personal information api requests do no fall into a transactional life cycle
// we need to treat them differently than contact information, but also still fall within
// the state update paradigm so that the UI reacts correctly
export function createSchedulingPreferencesUpdate({
  route,
  method = 'POST',
  fieldName,
  payload,
  analyticsSectionName,
  value,
  recordAnalyticsEvent = recordEvent,
}) {
  return async dispatch => {
    const options = {
      body: JSON.stringify(payload),
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const apiEventName = `${method} ${route}`;

    try {
      dispatch({
        type: VAP_SERVICE_TRANSACTION_REQUESTED,
        fieldName,
        method,
      });

      recordAnalyticsEvent(
        createApiEvent({
          name: apiEventName,
          status: 'started',
        }),
      );

      const response = await apiRequest(route, options);

      handleServerErrorResponse(response);

      recordAnalyticsEvent(
        createApiEvent({
          name: apiEventName,
          status: 'successful',
        }),
      );

      // clearTransaction uses this transactionId in a lookup to remove it
      set(
        response,
        'data.attributes.transactionId',
        `${fieldName}_${response?.attributes?.[fieldName]?.sourceDate}`,
      );

      dispatch({
        type: VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
        fieldName,
        transaction: response,
      });

      dispatch({
        type: UPDATE_SCHEDULING_PREFERENCES_FIELD,
        fieldName,
        value,
      });

      dispatch(clearTransaction(response));
    } catch (error) {
      captureAndRecordError({
        error,
        apiEventName,
        analyticsSectionName,
        recordAnalyticsEvent,
      });
      dispatch({
        type: VAP_SERVICE_TRANSACTION_REQUEST_FAILED,
        error,
        fieldName,
      });
    }
  };
}
