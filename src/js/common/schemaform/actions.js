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
    return fetch(`${environment.API_URL}${formConfig.submitUrl}`, {
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

/**
 * Loads the form data from the back end into the redux store.
 *
 * @param  {Object} formConfig The form's config
 */
export function loadFormData(formConfig) {
  return dispatch => {
    // Query the api
    fetch(`${environment.API_URL}/v0/in_progress_forms/${formConfig.formId}`, {
      mode: 'cors', // Necessary?
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel'
        // Token: // Get the auth token...
      },
    }).then((res) => {
      if (res.ok) {
        // Note: form_data !== formData
        return JSON.parse(res.json()).form_data;
      }
      // Is this the right reject text?
      return Promise.reject(res.statusText);
    }).then((formData) => {
      // If we've got valid form
      // Update the formData if the version is less than the current
      // Finally, set the data in the redux store
      dispatch(setData(formData));
    });
  };
}

/**
 * Saves the form data to the back end
 * @param  {Object} formConfig The form's config
 * @param  {Object} formData   The data the user has entered so far
 */
export function saveFormData(formConfig, form) {
  const body = {
    data: form.data,
    version: formConfig.version
  };
  return dispatch => { // eslint-disable-line no-unused-vars
    // Query the api
    fetch(`${environment.API_URL}/v0/in_progress_forms/${formConfig.formId}`, {
      method: 'POST',
      mode: 'cors', // Necessary?
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel'
        // Token: // Get the auth token...
      },
      body
    }).then((res) => {
      if (res.ok) {
        // Set save status = 'success'
      }
      // Set save status = 'fail' and cry about it
    });
  };
}
