import { flattenFormData } from './helpers';
import environment from '../helpers/environment.js';

export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_DATA = 'SET_DATA';
export const SET_VALID = 'SET_VALID';
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

export function setValid(page, valid) {
  return {
    type: SET_VALID,
    page,
    valid
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
  const formData = flattenFormData(form);
  return dispatch => {
    // dispatch(updateCompletedStatus('/1990/review-and-submit'));
    dispatch(setSubmission('status', 'submitPending'));
    window.dataLayer.push({
      event: 'edu-submission',
    });
    fetch(`${environment.API_URL}${formConfig.submitUrl}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel'
      },
      body: JSON.stringify({
        educationBenefitsClaim: {
          form: formData
        }
      })
    })
    .then(res => {
      if (res.ok) {
        window.dataLayer.push({
          event: 'edu-submission-successful',
        });
        return res.json();
      }
      window.dataLayer.push({
        event: 'edu-submission-failed',
      });
      return Promise.reject(res.statusText);
    })
    .then(
      (resp) => dispatch(setSubmitted(resp.data)),
      () => dispatch(setSubmission('status', 'error'))
    );
  };
}
