import Raven from 'raven-js';
import environment from '../helpers/environment.js';
import 'isomorphic-fetch';
import { logOut } from '../../login/actions';

import { setData } from './actions';

export const SET_SAVE_FORM_STATUS = 'SET_SAVE_FORM_STATUS';
export const SET_FETCH_FORM_STATUS = 'SET_FETCH_FORM_STATUS';
export const SET_IN_PROGRESS_FORM = 'SET_IN_PROGRESS_FORM';

export const SAVE_STATUSES = Object.freeze({
  notAttempted: 'not-attempted',
  pending: 'pending',
  noAuth: 'no-auth',
  failure: 'failure',
  success: 'success'
});
// TODO: Use these statuses to display an error message somewhere
export const LOAD_STATUSES = Object.freeze({
  notAttempted: 'not-attempted',
  pending: 'pending',
  noAuth: 'no-auth',
  failure: 'failure',
  notFound: 'not-found',
  invalidData: 'invalid-data',
  success: 'success'
});

export function setSaveFormStatus(status, lastSavedDate = null) {
  return {
    type: SET_SAVE_FORM_STATUS,
    status,
    lastSavedDate
  };
}

export function setFetchFormStatus(status) {
  return {
    type: SET_FETCH_FORM_STATUS,
    status
  };
}

export function setInProgressForm(data) {
  return {
    type: SET_IN_PROGRESS_FORM,
    data
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
export function migrateFormData(savedData, savedVersion, migrations) {
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

  // Break out early in case we don't have any migrations for the form yet
  if (!migrations) {
    return savedData;
  }

  let savedDataCopy = Object.assign({}, savedData);
  while (typeof migrations[savedVersion] === 'function') {
    savedDataCopy = migrations[savedVersion](savedDataCopy);
    savedVersion++; // eslint-disable-line no-param-reassign
  }

  return savedDataCopy;
}

/**
 * Saves the form data to the back end
 * @param  {String}  formId    The form's formId
 * @param  {Ingeter} version   The form's version
 * @param  {String}  returnUrl The last URL the user was at before saving
 * @param  {Object}  formData  The data the user has entered so far
 */
export function saveInProgressForm(formId, version, returnUrl, formData) {
  const savedAt = Date.now();
  // Double stringify because of api reasons. Olive Branch issues, methinks.
  // TODO: Stop double stringifying
  const body = JSON.stringify({
    metadata: JSON.stringify({
      version,
      returnUrl,
      savedAt
    }),
    formData: JSON.stringify(formData)
  });
  return dispatch => {
    const userToken = sessionStorage.userToken;
    // If we don't have a userToken, fail safely
    if (!userToken) {
      dispatch(setSaveFormStatus(SAVE_STATUSES.noAuth)); // Shouldn't get here, but...
      Raven.captureMessage('vets_sip_missing_token');
      return Promise.resolve();
    }

    // Update UI while we're waiting for the API
    dispatch(setSaveFormStatus(SAVE_STATUSES.pending));

    // Query the api
    // (returning for testing purposes only)
    return fetch(`${environment.API_URL}/v0/in_progress_forms/${formId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        Authorization: `Token token=${userToken}`
      },
      body
    }).then((res) => {
      if (res.ok) {
        dispatch(setSaveFormStatus(SAVE_STATUSES.success, savedAt));
        return Promise.resolve();
      }

      return Promise.reject(res);
    })
    .catch((resOrError) => {
      if (resOrError instanceof Response) {
        if (resOrError.status === 401) {
          // This likely means their session expired, so mark them as logged out
          dispatch(logOut());
          dispatch(setSaveFormStatus(SAVE_STATUSES.noAuth));
          Raven.captureException(new Error(`vets_sip_error_server_unauthorized: ${resOrError.statusText}`));
        } else {
          dispatch(setSaveFormStatus(SAVE_STATUSES.failure));
          Raven.captureException(new Error(`vets_sip_error_server: ${resOrError.statusText}`));
        }
      } else {
        dispatch(setSaveFormStatus(SAVE_STATUSES.failure));
        Raven.captureException(resOrError);
      }
    });
  };
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
export function fetchInProgressForm(formId, migrations) {
  // TODO: Test if the form is still saved after submission.
  // TODO: Migrations currently aren't sent; they're taken from `form` in the
  //  redux store, but form.migrations doesn't exist (nor should it, really)
  return dispatch => {
    const userToken = sessionStorage.userToken;
    // If we don't have a userToken, fail safely
    if (!userToken) {
      dispatch(setFetchFormStatus(LOAD_STATUSES.noAuth)); // Shouldn't get here, but just in case
      return Promise.reject('no auth');
    }

    // Update UI while we're waiting for the API
    dispatch(setFetchFormStatus(LOAD_STATUSES.pending));

    // Query the api and return a promise (for navigation / error handling afterward)
    return fetch(`${environment.API_URL}/v0/in_progress_forms/${formId}`, {
      // TODO: These headers should work, but trigger an api error right now
      headers: {
        'Content-Type': 'application/json',
        // 'X-Key-Inflection': 'camel',
        Authorization: `Token token=${userToken}`
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      let status = LOAD_STATUSES.failure;
      if (res.status === 401) {
        // TODO: If they've sat on the page long enough for their token to expire
        //  and try to load, tell them their session expired and they need to log
        //  back in and try again.
        status = LOAD_STATUSES.noAuth;
      } else if (res.status === 404) {
        status = LOAD_STATUSES.notFound;
      }
      return Promise.reject(status);
    }).then((resBody) => {
      // Just in case something funny happens where the json returned isn't an object as expected
      // Unfortunately, JavaScript is quite fiddly here, so there has to be additional checks
      if (typeof resBody !== 'object' || Array.isArray(resBody) || !resBody) {
        return Promise.reject(LOAD_STATUSES.invalidData);
      }

      // If an empty object is returned, throw a not-found
      // TODO: When / if we return a 404 for applications that don't exist, remove this
      if (Object.keys(resBody).length === 0) {
        return Promise.reject(LOAD_STATUSES.notFound);
      }

      // If we've made it this far, we've got valid form

      let formData;
      try {
        // NOTE: This may change to be migrated in the back end before sent over
        formData = migrateFormData(resBody.form_data, resBody.metadata.version, migrations);
        // formData = migrateFormData(resBody.formData, resBody.metadata.version, migrations);
      } catch (e) {
        // TODO: Log e.message somewhere; it's the reason the data couldn't be
        //  transformed. Sentry error?
        return Promise.reject(LOAD_STATUSES.invalidData);
      }
      // Set the data in the redux store
      // NOTE: Until we get the api for the list of filled forms, we're using this
      //  function to see if the form has been filled in, so this is setting the
      //  data in a separate place to be pulled in when we _actually_ want to load
      //  the formData.
      dispatch(setData(formData));
      dispatch(setInProgressForm({ formData, metadata: resBody.metadata }));

      return Promise.resolve();
    }).catch((status) => {
      let loadedStatus = status;
      if (status instanceof SyntaxError) {
        // if res.json() has a parsing error, it'll reject with a SyntaxError
        // TODO: Log this somehow...Sentry error?
        console.error('Could not parse response.', status); // eslint-disable-line no-console
        loadedStatus = LOAD_STATUSES.invalidData;
      } else if (status instanceof Error) {
        // If we've got an error that isn't a SyntaxError, it's probably a network error
        loadedStatus = LOAD_STATUSES.failure;
      }
      dispatch(setFetchFormStatus(loadedStatus));

      // Return a rejected promise to tell the caller there was a problem
      return Promise.reject();
    });
  };
}
