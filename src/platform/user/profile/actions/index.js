import { removeFormApi } from '../../../forms/save-in-progress/api';
import environment from '../../../utilities/environment';
import conditionalStorage from '../../../utilities/storage/conditionalStorage';
import { updateLoggedInStatus } from '../../authentication/actions';
import { setupProfileSession, teardownProfileSession } from '../utilities';

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
      url += `?now=${new Date().getTime()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Token token=${conditionalStorage().getItem(
          'userToken',
        )}`,
      }),
    });

    if (!response.ok) {
      const error = new Error(response.statusText);
      error.status = response.status;
      throw error;
    }

    const payload = await response.json();
    dispatch(updateProfileFields(payload));
    return payload;
  };
}

export function initializeProfile() {
  return async dispatch => {
    try {
      const payload = await dispatch(refreshProfile());
      setupProfileSession(payload);
      dispatch(updateLoggedInStatus(true));
    } catch (error) {
      if (error.status === 401) teardownProfileSession();
      dispatch(profileLoadingFinished());
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
