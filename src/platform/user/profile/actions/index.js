import recordEvent from '../../../monitoring/record-event';
import { removeFormApi } from '../../../../applications/common/schemaform/save-in-progress/api';
import { updateLoggedInStatus } from '../../authentication/actions';
import environment from '../../../utilities/environment';

export const UPDATE_PROFILE_FIELDS = 'UPDATE_PROFILE_FIELDS';
export const PROFILE_LOADING_FINISHED = 'PROFILE_LOADING_FINISHED';
export const REMOVING_SAVED_FORM = 'REMOVING_SAVED_FORM';
export const REMOVING_SAVED_FORM_SUCCESS = 'REMOVING_SAVED_FORM_SUCCESS';
export const REMOVING_SAVED_FORM_FAILURE = 'REMOVING_SAVED_FORM_FAILURE';
export const UPDATE_VET360_PROFILE_FIELD = 'UPDATE_VET360_PROFILE_FIELD';

export * from './mhv';

export function updateProfileFields(payload) {
  return {
    type: UPDATE_PROFILE_FIELDS,
    payload
  };
}

export function profileLoadingFinished() {
  return {
    type: PROFILE_LOADING_FINISHED
  };
}

export function getProfile() {
  return (dispatch) => {
    return fetch(`${environment.API_URL}/v0/user`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Token token=${sessionStorage.userToken}`
      })
    }).then(response => {
      if (response.ok) return response.json();
      const error = new Error(response.statusText);
      error.status = response.status;
      throw error;
    }).then(payload => {
      const userData = payload.data.attributes.profile;
      // sessionStorage coerces everything into String. this if-statement
      // is to prevent the firstname being set to the string 'Null'
      if (userData.first_name) {
        sessionStorage.setItem('userFirstName', userData.first_name);
      }
      // Report out the current level of assurance for the user
      recordEvent({ event: `login-loa-current-${userData.loa.current}` });
      dispatch(updateProfileFields(payload));
      dispatch(updateLoggedInStatus(true));
    }).catch(error => {
      if (error.status === 401) {
        for (const key of ['entryTime', 'userToken', 'userFirstName']) {
          sessionStorage.removeItem(key);
        }
      }
      dispatch(profileLoadingFinished());
    });
  };
}

export function removingSavedForm() {
  return {
    type: REMOVING_SAVED_FORM
  };
}

export function removingSavedFormSuccess() {
  return {
    type: REMOVING_SAVED_FORM_SUCCESS
  };
}

export function removingSavedFormFailure() {
  return {
    type: REMOVING_SAVED_FORM_FAILURE
  };
}

export function removeSavedForm(formId) {
  return dispatch => {
    dispatch(removingSavedForm());
    return removeFormApi(formId)
      .then(() => {
        dispatch({ type: REMOVING_SAVED_FORM_SUCCESS, formId });
        dispatch(getProfile());
      })
      .catch(() => dispatch(removingSavedFormFailure()));
  };
}
