import appendQuery from 'append-query';

import { removeFormApi } from 'platform/forms/save-in-progress/api';
import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import { isVAProfileServiceConfigured } from 'platform/user/profile/vap-svc/util/local-vapsvc';
import { updateLoggedInStatus } from '../../authentication/actions';
import { infoTokenExists, refresh } from '../../../utilities/oauth/utilities';
import { teardownProfileSession } from '../utilities';

export const UPDATE_PROFILE_FIELDS = 'UPDATE_PROFILE_FIELDS';
export const PROFILE_LOADING_FINISHED = 'PROFILE_LOADING_FINISHED';
export const REMOVING_SAVED_FORM = 'REMOVING_SAVED_FORM';
export const REMOVING_SAVED_FORM_SUCCESS = 'REMOVING_SAVED_FORM_SUCCESS';
export const REMOVING_SAVED_FORM_FAILURE = 'REMOVING_SAVED_FORM_FAILURE';

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

async function saveAndRefresh(payload) {
  const newPayloadObject = { payload };
  const { serviceName } = payload.data.attributes.profile.signIn || '';
  if (payload.errors === 'Access token has expired' && infoTokenExists()) {
    const refreshResponse = await refresh({ type: serviceName });
    if (!refreshResponse.ok) {
      throw new Error('Could not refresh AT');
    }

    const newPayload = await apiRequest(baseUrl);
    return { payload: newPayload };
  }

  return newPayloadObject;
}

export function refreshProfile(
  forceCacheClear = false,
  localQuery = { local: 'none' },
) {
  const query = {
    now: new Date().getTime(),
    ...(isVAProfileServiceConfigured() ? {} : localQuery),
  };
  return async dispatch => {
    const url = forceCacheClear ? appendQuery(baseUrl, query) : baseUrl;

    const payload = await apiRequest(url);
    const saved = await saveAndRefresh(payload);

    recordEvent({
      event: 'api_call',
      'api-name': 'GET /v0/user',
      'api-status': 'successful',
    });

    dispatch(updateProfileFields(saved.payload));
    return saved.payload;
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
