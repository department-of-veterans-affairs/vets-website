/**
 * @module personalInformation
 * @description Redux actions for fetching and updating Veteran information managed by va.gov/profile and VA Profile.
 * @see {@link https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/profile|VA Profile API Documentation}
 */

import appendQuery from 'append-query';
import set from 'lodash/set';
import capitalize from 'lodash/capitalize';

import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';

import { captureError, createApiEvent, ERROR_SOURCES } from '../util/analytics';
import { PERSONAL_INFO_FIELD_NAMES, FIELD_NAMES } from '../constants'; // eslint-disable-line no-unused-vars

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

/**
 * Fetches the /profile/personal_information resource from the VA Profile Service API.
 *
 * @see {@link https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/profile/getPersonalInformation|VA.gov OpenAPI Documentation}
 *
 * The function handles several data transformations:
 * - Capitalizes preferred names (API returns ALL CAPS)
 * - Normalizes null gender identity codes to empty strings for validation
 * - Dispatches appropriate Redux actions for loading/success/failure states
 *
 * @param {boolean} [forceCacheClear=false] - Whether to bypass browser cache by appending timestamp
 * @param {Function} [recordAnalyticsEvent=recordEvent] - Analytics recording function for tracking API calls
 *
 * @returns {Function} Redux thunk function that dispatches actions and makes API call
 *
 * @dispatches {Object} FETCH_PERSONAL_INFORMATION - Indicates fetch has started (loading state)
 * @dispatches {Object} FETCH_PERSONAL_INFORMATION_SUCCESS - Contains fetched personal information data
 * @dispatches {Object} FETCH_PERSONAL_INFORMATION_FAILED - Contains error information if fetch fails
 *
 * @example
 * // Basic usage - fetch with default caching behavior
 * dispatch(fetchPersonalInformation());
 *
 * @example
 * // Force cache clear (useful for refreshing stale data)
 * dispatch(fetchPersonalInformation(true));
 *
 * @example
 * // With custom analytics tracking
 * dispatch(fetchPersonalInformation(false, customAnalyticsFunc));
 *
 * @description Common usage contexts:
 * - Profile application
 * - Personal information form prefilling
 * - Display of user preferences in messaging and communication
 *
 * @throws {Error} Captures and handles API errors, server errors, and network failures
 *
 */
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

/**
 * Creates a Redux thunk action for updating personal information fields.
 *
 * Unlike contact information updates (email, phone, address) which use VA Profile Service's
 * transaction-based lifecycle, personal information updates are processed immediately
 * but still need to integrate with the existing state management and UI patterns.
 *
 * This function handles the complete update flow:
 * 1. Dispatches transaction requested action (for UI loading states)
 * 2. Makes API request to update the field
 * 3. Handles success/error responses, reports events to analytics
 * 4. Updates Redux state optimistically
 * 5. Clears the transaction from state
 *
 * @param {Object} params - Configuration object for the update
 * @param {string} params.route - API endpoint route for the update. Possible values:
 *   - '/profile/preferred_names' - For preferred name updates
 *   - '/profile/gender_identities' - For gender identity updates
 * @param {string} [params.method='PUT'] - HTTP method for the request
 * @param {keyof typeof FIELD_NAMES} params.fieldName - Field identifier for Redux state management
 * @param {Object} params.payload - Request payload data to send to the API
 * @param {string} [params.analyticsSectionName] - Analytics section name for tracking. Possible values:
 *   - 'personal-information' - General personal info section
 *   - 'contact-information' - Contact info section
 *   - 'account-security' - Security-related updates
 *   - Defaults to 'unknown-profile-section' if not provided
 * @param {*} params.value - The new field value for optimistic UI updates
 * @param {Function} [params.recordAnalyticsEvent=recordEvent] - Analytics recording function
 *
 * @returns {Function} Redux thunk function that dispatches actions and makes API calls
 *
 * @dispatches {Object} VAP_SERVICE_TRANSACTION_REQUESTED - Indicates update request has started
 * @dispatches {Object} VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED - Contains successful transaction data
 * @dispatches {Object} VAP_SERVICE_TRANSACTION_REQUEST_FAILED - Contains error information if update fails
 *
 * @example
 * // Update preferred name
 * dispatch(createPersonalInfoUpdate({
 *   route: '/profile/preferred_names',
 *   method: 'PUT',
 *   fieldName: 'preferredName',
 *   payload: { text: 'John Doe' },
 *   analyticsSectionName: 'personal-information',
 *   value: 'John Doe'
 * }));
 *
 * @see {@link https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/profile} VA Profile API Documentation
 */
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
