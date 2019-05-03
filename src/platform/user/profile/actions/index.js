import appendQuery from 'append-query';

import { removeFormApi } from 'platform/forms/save-in-progress/api';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { updateLoggedInStatus } from '../../authentication/actions';
import { teardownProfileSession } from '../utilities';

export const UPDATE_PROFILE_FIELDS = 'UPDATE_PROFILE_FIELDS';
export const PROFILE_LOADING_FINISHED = 'PROFILE_LOADING_FINISHED';
export const REMOVING_SAVED_FORM = 'REMOVING_SAVED_FORM';
export const REMOVING_SAVED_FORM_SUCCESS = 'REMOVING_SAVED_FORM_SUCCESS';
export const REMOVING_SAVED_FORM_FAILURE = 'REMOVING_SAVED_FORM_FAILURE';

export * from './mhv';

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

export function refreshProfile(forceCacheClear = false) {
  return async dispatch => {
    let url = `${environment.API_URL}/v0/user`;

    if (forceCacheClear) {
      url = appendQuery(url, { now: new Date().getTime() });
    }

    const payload = await apiRequest(url);
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
      dispatch(updateLoggedInStatus(false));
      teardownProfileSession();
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
