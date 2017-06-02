import { transformForSubmit } from './helpers';
import environment from '../helpers/environment.js';

export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_DATA = 'SET_DATA';
export const SET_PRIVACY_AGREEMENT = 'SET_PRIVACY_AGREEMENT';
export const SET_SUBMISSION = 'SET_SUBMISSION';
export const SET_SUBMITTED = 'SET_SUBMITTED';
export const SET_SAVED = 'SET_SAVED';
export const SET_LOADED = 'SET_LOADED';
export const SET_LOADED_DATA = 'SET_LOADED_DATA';
export const LOAD_DATA = 'LOAD_DATA';

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

export function setLoadedData(data) {
  return {
    type: SET_LOADED_DATA,
    data
  };
}

export function loadData() {
  return {
    type: LOAD_DATA
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
  if (!migrations || typeof migrations[savedVersion] !== 'function') {
    return savedData;
  }
  return getUpdatedFormData(migrations[savedVersion](savedData), savedVersion + 1, migrations);
}

/**
 * Loads the form data from the back end into the redux store.
 *
 * @param  {Integer} formId      The form's identifier
 * @param  {Array}   migrations  An array of functions to run the data returned
 *                                from the server through in the event that the
 *                                version of the form the data was saved with
 *                                is different from the current version.
 */
export function loadFormData(formId, migrations) {
  // TODO: Test if the form is still saved after submission.
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
    fetch(`${environment.API_URL}/v0/in_progress_forms/${formId}`, {
      // TODO: These headers should work, but trigger an api error right now
      headers: {
        'Content-Type': 'application/json',
        // 'X-Key-Inflection': 'camel',
        Authorization: `Token token=${userToken}`
      },
    }).then((res) => {
      // console.log('res', res);
      if (res.ok) {
        return res.json();
      }

      let status = 'failure';
      if (res.status === 401) {
        // TODO: If they've sat on the page long enough for their token to expire
        //  and try to load, tell them their session expired and they need to log
        //  back in and try again.
        status = 'no-auth';
      } else if (res.status === 404) {
        status = 'not-found';
      }
      return Promise.reject(status);
    }).then((resBody) => {  // eslint-disable-line consistent-return
      // Just in case something funny happens where the json returned isn't an object as expected
      if (typeof resBody !== 'object') {
        return Promise.reject('invalid-data');
      }

      // If an empty object is returned, throw a not-found
      // TODO: When / if we return a 404 for applications that don't exist, remove this
      if (Object.keys(resBody).length === 0) {
        return Promise.reject('not-found');
      }

      // If we've made it this far, we've got valid form

      // TODO: Remove the assignment once the API is updated to store and return
      //  formData and metadata
      let formData;
      try {
        // NOTE: This may change to be migrated in the back end before sent over
        formData = getUpdatedFormData(resBody.form_data, resBody.metadata.version, migrations);
        // formData = getUpdatedFormData(resBody.formData, resBody.metadata.version, migrations);
      } catch (e) {
        // TODO: Log e.message somewhere; it's the reason the data couldn't be
        //  transformed. Sentry error?
        return Promise.reject('invalid-data');
      }
      // Set the data in the redux store
      // NOTE: Until we get the api for the list of filled forms, we're using this
      //  function to see if the form has been filled in, so this is setting the
      //  data in a separate place to be pulled in when we _actually_ want to load
      //  the formData.
      // dispatch(setData(formData));
      dispatch(setLoadedData({ formData, metadata: resBody.metadata }));
      dispatch(setLoaded('success'));
    }).catch((status) => {
      let loadedStatus = status;
      // if res.json() has a parsing error, it'll reject with a SyntaxError
      if (status instanceof SyntaxError) {
        // TODO: Log this somehow...Sentry error?
        console.error('Could not parse response.', status); // eslint-disable-line no-console
        loadedStatus = 'invalid-data';
      }
      dispatch(setLoaded(loadedStatus));
    });
  };
}

/**
 * Saves the form data to the back end
 * @param  {String}  formId    The form's formId
 * @param  {Ingeter} version   The form's version
 * @param  {String}  returnUrl The last URL the user was at before saving
 * @param  {Object}  formData  The data the user has entered so far
 */
export function saveFormData(formId, version, returnUrl, formData) {
  // Double stringify because of api reasons. Olive Branch issues, methinks.
  const body = JSON.stringify({
    metadata: JSON.stringify({
      version,
      returnUrl
    }),
    formData: JSON.stringify(formData)
  });
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
    fetch(`${environment.API_URL}/v0/in_progress_forms/${formId}`, {
      method: 'PUT',
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
        } else {
          dispatch(setSaved('failure'));
        }
      }
    });
  };
}
