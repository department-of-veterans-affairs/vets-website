import Raven from 'raven-js';
import environment from '../helpers/environment.js';
import 'isomorphic-fetch';
import { logOut } from '../../login/actions';

export const SET_SAVE_FORM_STATUS = 'SET_SAVE_FORM_STATUS';
export const SET_FETCH_FORM_STATUS = 'SET_FETCH_FORM_STATUS';
export const SET_FETCH_FORM_PENDING = 'SET_FETCH_FORM_PENDING';
export const SET_IN_PROGRESS_FORM = 'SET_IN_PROGRESS_FORM';
export const SET_START_OVER = 'SET_START_OVER';
export const SET_PREFILL_UNFILLED = 'SET_PREFILL_UNFILLED';

export const SAVE_STATUSES = Object.freeze({
  notAttempted: 'not-attempted',
  pending: 'pending',
  noAuth: 'no-auth',
  failure: 'failure',
  clientFailure: 'clientFailure',
  success: 'success'
});

export const saveErrors = new Set([SAVE_STATUSES.failure, SAVE_STATUSES.clientFailure, SAVE_STATUSES.noAuth]);

export const LOAD_STATUSES = Object.freeze({
  notAttempted: 'not-attempted',
  pending: 'pending',
  noAuth: 'no-auth',
  failure: 'failure',
  notFound: 'not-found',
  invalidData: 'invalid-data',
  success: 'success'
});

export const PREFILL_STATUSES = Object.freeze({
  notAttempted: 'not-attempted',
  pending: 'pending',
  success: 'success',
  unfilled: 'unfilled'
});

export function setSaveFormStatus(status, lastSavedDate = null, expirationDate = null) {
  return {
    type: SET_SAVE_FORM_STATUS,
    status,
    lastSavedDate,
    expirationDate
  };
}

export function setFetchFormStatus(status) {
  return {
    type: SET_FETCH_FORM_STATUS,
    status
  };
}

export function setFetchFormPending(prefill) {
  return {
    type: SET_FETCH_FORM_PENDING,
    prefill
  };
}

export function setInProgressForm(data) {
  return {
    type: SET_IN_PROGRESS_FORM,
    data
  };
}

export function setStartOver() {
  return {
    type: SET_START_OVER
  };
}

export function setPrefillComplete() {
  return {
    type: SET_PREFILL_UNFILLED,
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
  // This works because every time the version is bumped on the form, it’s because
  //  the saved data needs to be manipulated, so there will be no skipped versions.

  // Break out early in case we don’t have any migrations for the form yet
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
 * @param  {String}  formId    The form’s formId
 * @param  {Ingeter} version   The form’s version
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
  return (dispatch, getState) => {
    const trackingPrefix = getState().form.trackingPrefix;
    const userToken = sessionStorage.userToken;
    // If we don’t have a userToken, fail safely
    if (!userToken) {
      dispatch(setSaveFormStatus(SAVE_STATUSES.noAuth)); // Shouldn’t get here, but...
      Raven.captureMessage('vets_sip_missing_token');
      window.dataLayer.push({
        event: `${trackingPrefix}sip-form-save-failed`
      });
      return Promise.resolve();
    }

    // Update UI while we’re waiting for the API
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
        return res.json();
      }

      return Promise.reject(res);
    }).then((json) => {
      dispatch(setSaveFormStatus(SAVE_STATUSES.success, savedAt, json.data.attributes.metadata.expiresAt));
      window.dataLayer.push({
        event: `${trackingPrefix}sip-form-saved`
      });
      return Promise.resolve();
    })
    .catch((resOrError) => {
      if (resOrError instanceof Response) {
        if (resOrError.status === 401) {
          // This likely means their session expired, so mark them as logged out
          dispatch(logOut());
          dispatch(setSaveFormStatus(SAVE_STATUSES.noAuth));
          window.dataLayer.push({
            event: `${trackingPrefix}sip-form-save-signed-out`
          });
        } else {
          dispatch(setSaveFormStatus(SAVE_STATUSES.failure));
          Raven.captureException(new Error(`vets_sip_error_server: ${resOrError.statusText}`));
          window.dataLayer.push({
            event: `${trackingPrefix}sip-form-save-failed`
          });
        }
      } else {
        dispatch(setSaveFormStatus(SAVE_STATUSES.clientFailure));
        Raven.captureException(resOrError);
        Raven.captureMessage('vets_sip_error_save');
        window.dataLayer.push({
          event: `${trackingPrefix}sip-form-save-failed-client`
        });
      }
    });
  };
}

/**
 * Loads the form data from the back end into the redux store.
 *
 * @param  {Integer} formId      The form’s identifier
 * @param  {Array}   migrations  An array of functions to run the data returned
 *                                from the server through in the event that the
 *                                version of the form the data was saved with
 *                                is different from the current version.
 */
export function fetchInProgressForm(formId, migrations, prefill = false) {
  // TODO: Migrations currently aren’t sent; they’re taken from `form` in the
  //  redux store, but form.migrations doesn’t exist (nor should it, really)
  return (dispatch, getState) => {
    const trackingPrefix = getState().form.trackingPrefix;
    const userToken = sessionStorage.userToken;
    // If we don’t have a userToken, fail safely
    if (!userToken) {
      dispatch(setFetchFormStatus(LOAD_STATUSES.noAuth));
      return Promise.resolve();
    }

    // Update UI while we’re waiting for the API
    dispatch(setFetchFormPending(prefill));

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
        dispatch(logOut());
        status = LOAD_STATUSES.noAuth;
      } else if (res.status === 404) {
        status = LOAD_STATUSES.notFound;
      }
      return Promise.reject(status);
    }).then((resBody) => {
      // Just in case something funny happens where the json returned isn’t an object as expected
      // Unfortunately, JavaScript is quite fiddly here, so there has to be additional checks
      if (typeof resBody !== 'object' || Array.isArray(resBody) || !resBody) {
        return Promise.reject(LOAD_STATUSES.invalidData);
      }

      // If an empty object is returned, throw a not-found
      // TODO: When / if we return a 404 for applications that don’t exist, remove this
      if (Object.keys(resBody).length === 0) {
        return Promise.reject(LOAD_STATUSES.notFound);
      }

      // If we’ve made it this far, we’ve got valid form

      let formData;
      try {
        // NOTE: This may change to be migrated in the back end before sent over
        formData = migrateFormData(resBody.form_data, resBody.metadata.version, migrations);
      } catch (e) {
        // We don’t want to lose the stacktrace, but want to be able to search for migration errors
        // related to SiP
        Raven.captureException(e);
        Raven.captureMessage('vets_sip_error_migration');
        return Promise.reject(LOAD_STATUSES.invalidData);
      }
      // Set the data in the redux store
      dispatch(setInProgressForm({ formData, metadata: resBody.metadata }, prefill));
      window.dataLayer.push({
        event: `${trackingPrefix}sip-form-loaded`
      });

      return Promise.resolve();
    }).catch((status) => {
      let loadedStatus = status;
      if (status instanceof SyntaxError) {
        // if res.json() has a parsing error, it’ll reject with a SyntaxError
        Raven.captureException(new Error(`vets_sip_error_server_json: ${status.message}`));
        loadedStatus = LOAD_STATUSES.invalidData;
      } else if (status instanceof Error) {
        // If we’ve got an error that isn’t a SyntaxError, it’s probably a network error
        Raven.captureException(status);
        Raven.captureMessage('vets_sip_error_fetch');
        loadedStatus = LOAD_STATUSES.failure;
      }

      // If prefilling went wrong for a non-auth reason, it probably means that
      // they didn’t have info to use and we can continue on as usual
      if (prefill && loadedStatus !== LOAD_STATUSES.noAuth) {
        dispatch(setPrefillComplete());
        window.dataLayer.push({
          event: `${trackingPrefix}sip-form-prefill-failed`
        });
      } else {
        // If we're in a noAuth status, users are sent to the error page
        // where they can sign in again. This isn't an error, it's expected
        // when a session expires
        if (loadedStatus === LOAD_STATUSES.noAuth) {
          window.dataLayer.push({
            event: `${trackingPrefix}sip-form-load-signed-out`
          });
        } else {
          Raven.captureMessage(`vets_sip_error_load: ${loadedStatus}`);
          window.dataLayer.push({
            event: `${trackingPrefix}sip-form-load-failed`
          });
        }
        dispatch(setFetchFormStatus(loadedStatus));
      }
    });
  };
}

export function removeInProgressForm(formId, migrations) {
  return (dispatch, getState) => {
    const userToken = sessionStorage.userToken;
    const trackingPrefix = getState().form.trackingPrefix;

    // Update UI while we’re waiting for the API
    dispatch(setStartOver());

    return fetch(`${environment.API_URL}/v0/in_progress_forms/${formId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'X-Key-Inflection': 'camel',
        Authorization: `Token token=${userToken}`
      },
    }).catch(res => {
      if (res instanceof Error) {
        Raven.captureException(res);
        Raven.captureMessage('vets_sip_error_delete');
        return Promise.resolve();
      } else if (!res.ok) {
        Raven.captureMessage(`vets_sip_error_delete: ${res.statusText}`);
      }

      return Promise.resolve(res);
    }).then((res) => {
      // If there’s some error when deleting, there’s not much we can
      // do aside from not stop the user from continuing on
      if (!res || res.status !== 401) {
        window.dataLayer.push({
          event: `${trackingPrefix}sip-form-start-over`
        });
        // after deleting, go fetch prefill info if they’ve got it
        return dispatch(fetchInProgressForm(formId, migrations, true));
      }

      dispatch(logOut());
      dispatch(setFetchFormStatus(LOAD_STATUSES.noAuth));

      return Promise.resolve();
    });
  };
}
