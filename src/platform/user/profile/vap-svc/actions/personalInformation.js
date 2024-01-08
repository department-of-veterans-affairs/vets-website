import appendQuery from 'append-query';
import set from 'lodash/set';
import capitalize from 'lodash/capitalize';

import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';

import { captureError, createApiEvent, ERROR_SOURCES } from '../util/analytics';
import { PERSONAL_INFO_FIELD_NAMES } from '../constants';

import {
  VAP_SERVICE_TRANSACTION_REQUESTED,
  VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
  VAP_SERVICE_TRANSACTION_REQUEST_FAILED,
  clearTransaction,
} from '.';

export const FETCH_PERSONAL_INFORMATION = 'FETCH_PERSONAL_INFORMATION';
export const FETCH_PERSONAL_INFORMATION_SUCCESS =
  'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_FAILED =
  'FETCH_PERSONAL_INFORMATION_FAILED';

export const UPDATE_PERSONAL_INFORMATION_FIELD =
  'UPDATE_PERSONAL_INFORMATION_FIELD';

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

export function fetchPersonalInformation(
  forceCacheClear = false,
  recordAnalyticsEvent = recordEvent,
) {
  return async dispatch => {
    dispatch({ type: FETCH_PERSONAL_INFORMATION });

    const baseUrl = '/profile/personal_information';

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

      const personalInfoData = response.data.attributes;

      recordAnalyticsEvent(
        createApiEvent({
          name: apiEventName,
          status: 'successful',
        }),
      );

      // preferred name returns as ALL CAPS, so it needs to be capitalized appropriately for display
      if (personalInfoData?.[PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME]) {
        set(
          personalInfoData,
          PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME,
          capitalize(
            personalInfoData?.[PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME],
          ),
        );
      }

      // a null code for gender identity needs to instead be set to an empty string or else
      // validation message will be incorrectly set to 'is not of a type(s) string'
      if (
        !personalInfoData?.[PERSONAL_INFO_FIELD_NAMES.GENDER_IDENTITY]?.code
      ) {
        set(
          personalInfoData,
          `${PERSONAL_INFO_FIELD_NAMES.GENDER_IDENTITY}.code`,
          '',
        );
      }

      dispatch({
        type: FETCH_PERSONAL_INFORMATION_SUCCESS,
        personalInformation: personalInfoData,
      });
    } catch (error) {
      captureAndRecordError({ error, apiEventName, recordAnalyticsEvent });
      dispatch({
        type: FETCH_PERSONAL_INFORMATION_FAILED,
        personalInformation: {
          error: { message: error.message || 'no error message provided' },
        },
      });
    }
  };
}

// since the personal information api requests do no fall into a transactional life cylce
// we need to treat them differently than contact information, but also still fall within
// the state update paradigm so that the UI reacts correctly
export function createPersonalInfoUpdate({
  route,
  method = 'PUT',
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

      // optimistic UI update to show saved field value
      dispatch({
        type: UPDATE_PERSONAL_INFORMATION_FIELD,
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
