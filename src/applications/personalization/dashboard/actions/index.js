import { removeFormApi } from '../../../../platform/forms/save-in-progress/api';
import { refreshProfile } from '../../../../platform/user/profile/actions';

export const PROFILE_LOADING_FINISHED = 'PROFILE_LOADING_FINISHED';
export const REMOVING_SAVED_FORM = 'REMOVING_SAVED_FORM';
export const REMOVING_SAVED_FORM_SUCCESS = 'REMOVING_SAVED_FORM_SUCCESS';
export const REMOVING_SAVED_FORM_FAILURE = 'REMOVING_SAVED_FORM_FAILURE';

export function profileLoadingFinished() {
  return {
    type: PROFILE_LOADING_FINISHED,
  };
}

export function removingSavedForm() {
  return {
    type: REMOVING_SAVED_FORM,
  };
}

export function removingSavedFormSuccess(formId) {
  return {
    type: REMOVING_SAVED_FORM_SUCCESS,
    formId,
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
        dispatch(removingSavedFormSuccess(formId));
        dispatch(refreshProfile());
      })
      .catch(() => dispatch(removingSavedFormFailure()));
  };
}
