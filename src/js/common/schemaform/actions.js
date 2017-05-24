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
 * Transforms the data from an old version of a form to be used in the latest
 *  version.
 *
 * @param  {Object}  savedData    The formData from the old version of the form.
 * @param  {Ingeter} savedVersion The version of the form the corresponding
 *                                 data was saved with.
 * @param  {Array}   migrations   An array of functions which transform the
 *                                 data saved to work with the current version.
 * @return {Object}               The modified formData which should work with
 *                                 the current version of the form.
 */
function getUpdatedFormData(savedData, savedVersion, migrations) {
  // migrations is an array that looks like this:
  // [
  //   (savedData) => {
  //     // Makes modifications to savedData to update it from version 0 -> version 1
  //   },
  //   (savedData) => {
  //     // Makes modifications to update the data from version 1 -> version 2
  //   },
  //   ...
  // ]
  // The functions transform the data from version of their index to the next one up.
  // This works because every time the version is bumped on the form, it's because
  //  the saved data needs to be manipulated, so there will be no skipped versions.
  if (typeof migrations[savedVersion] !== 'function') {
    return savedData;
  }
  return getUpdatedFormData(migrations[savedVersion](savedData), savedVersion + 1, migrations);
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
        'X-Key-Inflection': 'camel',
        Token: window.sessionStorage.get('userToken') // TODO: Verify this is correct
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // Is this the right reject text?
      return Promise.reject(res.statusText);
    }).then((json) => {
      // We've got valid form
      // Note: The api returns the data we saved wrapped in a form_data object:
      // {
      //   "form_data": {
      //     "formData": { ... },
      //     "version": 1
      //   }
      // }
      const resBody = JSON.parse(json).form_data;

      try {
        // Note: This may change to be updated in the back end before sent over
        const formData = getUpdatedFormData(resBody.formData, resBody.version, formConfig.migrations);
        // Finally, set the data in the redux store
        dispatch(setData(formData));
      } catch (e) {
        // return Promise.reject(e.message);
      }
    }).catch((rejectReason) => {
      // Do something
      console.error(`Bummer! Can't load the form. ${rejectReason}`); // eslint-disable-line no-console
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
        'X-Key-Inflection': 'camel',
        Token: window.sessionStorage.get('userToken') // TODO: Verify this is correct
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
