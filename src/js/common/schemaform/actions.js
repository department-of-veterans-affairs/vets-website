import { transformForSubmit } from './helpers';
import environment from '../helpers/environment.js';

export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_DATA = 'SET_DATA';
export const SET_PRIVACY_AGREEMENT = 'SET_PRIVACY_AGREEMENT';
export const SET_SUBMISSION = 'SET_SUBMISSION';
export const SET_SUBMITTED = 'SET_SUBMITTED';

export function setData(page, data) {
  return {
    type: SET_DATA,
    data,
    page
  };
}

export function setEditMode(page, edit) {
  return {
    type: SET_EDIT_MODE,
    edit,
    page
  };
}

export function setSubmission(field, value) {
  return {
    type: SET_SUBMISSION,
    field,
    value
  };
}

export function setPrivacyAgreement(privacyAgreementAccepted) {
  return {
    type: SET_PRIVACY_AGREEMENT,
    privacyAgreementAccepted
  };
}

export function setSubmitted(response) {
  return {
    type: SET_SUBMITTED,
    response
  };
}

export function submitForm(formConfig, form) {
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  return dispatch => {
    dispatch(setSubmission('status', 'submitPending'));
    window.dataLayer.push({
      event: `${formConfig.trackingPrefix}-submission`,
    });
    fetch(`${environment.API_URL}${formConfig.submitUrl}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel'
      },
      body
    })
    .then(res => {
      if (res.ok) {
        window.dataLayer.push({
          event: `${formConfig.trackingPrefix}-submission-successful`,
        });
        return res.json();
      }
      window.dataLayer.push({
        event: `${formConfig.trackingPrefix}-submission-failed`,
      });
      return Promise.reject(res.statusText);
    })
    .then(
      (resp) => dispatch(setSubmitted(resp.data)),
      () => dispatch(setSubmission('status', 'error'))
    );
  };
}
