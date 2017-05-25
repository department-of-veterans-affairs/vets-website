import { transformForSubmit } from './helpers';
import environment from '../helpers/environment.js';

export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_DATA = 'SET_DATA';
export const SET_PRIVACY_AGREEMENT = 'SET_PRIVACY_AGREEMENT';
export const SET_SUBMISSION = 'SET_SUBMISSION';
export const SET_SUBMITTED = 'SET_SUBMITTED';
export const SET_SAVED = 'SET_SAVED';
export const SET_LOADED = 'SET_LOADED';

export function setData(data) {
  return {
    type: SET_DATA,
    data
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
    response: typeof response.data !== 'undefined' ? response.data : response
  };
}

// Possible statuses: pending, no-auth, failure, success
export function setSaved(status) {
  return {
    type: SET_SAVED,
    status
  };
}

// Possible statuses: pending, no-auth, failure, success
export function setLoaded(status) {
  return {
    type: SET_LOADED,
    status
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
      (resp) => dispatch(setSubmitted(resp)),
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
    const userToken = sessionStorage.userToken;
    // If we don't have a userToken, fail safely
    if (!userToken) {
      dispatch(setLoaded('no-auth')); // Shouldn't get here, but just in case
      return;
    }

    // Update UI while we're waiting for the API
    dispatch(setLoaded('pending'));

    // Query the api
    fetch(`${environment.API_URL}/v0/in_progress_forms/${formConfig.formId}`, {
      headers: {
        'Content-Type': 'application/json',
        // 'X-Key-Inflection': 'camel',
        Authorization: `Token token=${userToken}`
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // TODO: If they've sat on the page long enough for their token to expire
      //  and try to load, tell them their session expired and they need to log
      //  back in and try again.
      if (res.status === 401) {
        dispatch(setLoaded('no-auth'));
      }

      // TODO: Get a better reject text....if necessary
      return Promise.reject(res.statusText);
    }).then((json) => {  // eslint-disable-line consistent-return
      // We've got valid form
      // Note: The api returns the data we saved wrapped in a form_data object:
      // {
      //   "form_data": {
      //     "formData": { ... },
      //     "version": 1,
      //     "lastPage": "url/to/page"
      //   }
      // }
      const resBody = JSON.parse(json).form_data;

      let formData;
      try {
        // Note: This may change to be migrated in the back end before sent over
        formData = getUpdatedFormData(resBody.formData, resBody.version, formConfig.migrations);
      } catch (e) {
        return Promise.reject(e.message);
      }
      // TODO: Send an event to update the UI?
      // Set the data in the redux store
      dispatch(setData(formData));
      dispatch(setLoaded('success'));
      // TODO: Navigate to the last page they were on
      // TODO: Handle this scenario:
      //  1) I fill out some information and save my progress.
      //  2) The form is updated and a field I've not filled out yet gets moved
      //     to a page I have already completed.
      //  3) I load my saved progress.
      //  4) I should be put in the page with the missing information.
    }).catch((rejectReason) => {
      // Do something
      dispatch(setLoaded('failure'));
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
    formData: form.data,
    version: formConfig.version
  };
  return dispatch => {
    const userToken = sessionStorage.userToken;
    // If we don't have a userToken, fail safely
    if (!userToken) {
      dispatch(setSaved('no-auth')); // Shouldn't get here either...
      return;
    }

    // Update UI while we're waiting for the API
    dispatch(setSaved('pending'));

    // Query the api
    fetch(`${environment.API_URL}/v0/in_progress_forms/${formConfig.formId}`, {
      method: 'PUT',
      // TODO: These headers should work, but trigger an api error right now
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        Authorization: `Token token=${userToken}`
      },
      body
    }).then((res) => {
      if (res.ok) {
        dispatch(setSaved('success'));
        // TODO: Redirect to...somewhere?
      } else {
        // TODO: If they've sat on the page long enough for their token to expire
        //  and try to save, tell them their session expired and they need to log
        //  back in and try again. Unfortunately, this means they'll lose all
        //  their information.
        if (res.status === 401) {
          dispatch(setSaved('no-auth'));
        }
        dispatch(setSaved('failure'));
      }
    });
  };
}
