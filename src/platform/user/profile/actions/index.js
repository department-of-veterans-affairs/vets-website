import appendQuery from 'append-query';

import { removeFormApi } from 'platform/forms/save-in-progress/api';
import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import { isVAProfileServiceConfigured } from 'platform/user/profile/vap-svc/util/local-vapsvc';
import { updateLoggedInStatus } from '../../authentication/actions';
import { teardownProfileSession } from '../utilities';

export const UPDATE_PROFILE_FIELDS = 'UPDATE_PROFILE_FIELDS';
export const PROFILE_LOADING_FINISHED = 'PROFILE_LOADING_FINISHED';
export const REMOVING_SAVED_FORM = 'REMOVING_SAVED_FORM';
export const REMOVING_SAVED_FORM_SUCCESS = 'REMOVING_SAVED_FORM_SUCCESS';
export const REMOVING_SAVED_FORM_FAILURE = 'REMOVING_SAVED_FORM_FAILURE';
export const PROFILE_ERROR = 'PROFILE_ERROR';

export * from './mhv';

const baseUrl = '/user';

export function updateProfileFields(payload) {
  return {
    type: UPDATE_PROFILE_FIELDS,
    payload,
  };
}

export function profileLoadingFinished() {
  return {
    type: PROFILE_LOADING_FINISHED,
  };
}

export function profileError() {
  return {
    type: PROFILE_ERROR,
  };
}

// check for errors from main response body, or from meta object (aka external service errors)
const hasError = dataPayload =>
  dataPayload?.errors?.length > 0 || dataPayload?.meta?.errors?.length > 0;

export const extractProfileErrors = dataPayload => {
  const metaDescriptions = dataPayload?.meta?.errors?.reduce(
    (acc, error, index) =>
      error?.description
        ? `${acc}${index > 0 ? ' | ' : ''}${error.description}`
        : acc,
    '',
  );

  const mainErrors = dataPayload?.errors?.reduce(
    (acc, error, index) =>
      error?.title ? `${acc}${index > 0 ? ' | ' : ''}${error.title}` : acc,
    '',
  );

  // if neither meta nor main errors, then no errors to extract and return default value
  if (!metaDescriptions && !mainErrors) {
    return 'No error messages found';
  }

  return `${metaDescriptions || ''}${mainErrors || ''}`;
};

export function refreshProfile(
  forceCacheClear = false,
  localQuery = { local: 'none' },
  recordAnalyticsEvent = recordEvent,
) {
  const query = {
    now: new Date().getTime(),
    ...(isVAProfileServiceConfigured() ? {} : localQuery),
  };
  return async dispatch => {
    const url = forceCacheClear ? appendQuery(baseUrl, query) : baseUrl;
    const payload = await apiRequest(url);

    if (!payload.errors) {
      sessionStorage.setItem(
        'serviceName',
        payload.data.attributes.profile?.signIn?.serviceName,
      );
    }

    const eventApiStatus = hasError(payload) ? 'failed' : 'successful';

    const errorKey = extractProfileErrors(payload);

    const eventData = {
      event: 'api_call',
      'api-name': 'GET /v0/user',
      'api-status': eventApiStatus,
    };

    if (hasError(payload) && errorKey) {
      eventData['error-key'] = errorKey;
    }

    recordAnalyticsEvent(eventData);

    dispatch(updateProfileFields(payload));
    return payload;
  };
}

export function initializeProfile() {
  return async dispatch => {
    try {
      await dispatch(refreshProfile());
      dispatch(updateLoggedInStatus(true));
    } catch (error) {
      /* If the fetch fails due to the browser cancelling the request due to a navigation event short circuit it to prevent terminating session */
      if (
        !(error instanceof TypeError) &&
        error.message !== 'Failed to fetch'
      ) {
        dispatch(updateLoggedInStatus(false));
        teardownProfileSession();
      } else {
        dispatch(profileError());
      }
    }
  };
}

export function removingSavedForm() {
  return {
    type: REMOVING_SAVED_FORM,
  };
}

export function removingSavedFormSuccess() {
  return {
    type: REMOVING_SAVED_FORM_SUCCESS,
  };
}

export function removingSavedFormFailure() {
  return {
    type: REMOVING_SAVED_FORM_FAILURE,
  };
}

export function removeSavedForm(formId) {
  return dispatch => {
    dispatch(removingSavedForm());
    return removeFormApi(formId)
      .then(() => {
        dispatch({ type: REMOVING_SAVED_FORM_SUCCESS, formId });
        dispatch(refreshProfile());
      })
      .catch(() => dispatch(removingSavedFormFailure()));
  };
}
