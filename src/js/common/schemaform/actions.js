import Raven from 'raven-js';
import { transformForSubmit } from './helpers';
import environment from '../helpers/environment.js';

export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_DATA = 'SET_DATA';
export const SET_PRIVACY_AGREEMENT = 'SET_PRIVACY_AGREEMENT';
export const SET_SUBMISSION = 'SET_SUBMISSION';
export const SET_SUBMITTED = 'SET_SUBMITTED';

export function setData(data) {
  return {
    type: SET_DATA,
    data
  };
}

export function setEditMode(page, edit, index = null) {
  return {
    type: SET_EDIT_MODE,
    edit,
    page,
    index
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
    response: typeof response.data !== 'undefined' ? response.data : response
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

    const fetchOptions = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel'
      },
      body
    };

    const userToken = sessionStorage.userToken;
    if (userToken) {
      fetchOptions.headers.Authorization = `Token token=${userToken}`;
    }

    return fetch(`${environment.API_URL}${formConfig.submitUrl}`, fetchOptions)
    .then(res => {
      if (res.ok) {
        window.dataLayer.push({
          event: `${formConfig.trackingPrefix}-submission-successful`,
        });
        return res.json();
      }

      return Promise.reject(new Error(res.statusText));
    })
    .then(resp => dispatch(setSubmitted(resp)))
    .catch(error => {
      Raven.captureException(error);
      window.dataLayer.push({
        event: `${formConfig.trackingPrefix}-submission-failed`,
      });
      dispatch(setSubmission('status', 'error'));
    });
  };
}
