import environment from '../helpers/environment.js';

export const SET_SAVE_FORM_STATUS = 'SET_SAVE_FORM_STATUS';
export const SET_FETCH_FORM_STATUS = 'SET_FETCH_FORM_STATUS';
export const SET_IN_PROGRESS_FORM = 'SET_IN_PROGRESS_FORM';
export const LOAD_DATA_INTO_FORM = 'LOAD_DATA_INTO_FORM';

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

export function setSaveFormStatus(status) {
  return {
    type: SET_SAVE_FORM_STATUS,
    status
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

export function loadInProgressDataIntoForm() {
  return {
    type: LOAD_DATA_INTO_FORM
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
function migrateFormData(savedData, savedVersion, migrations) {
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
      dispatch(setSaveFormStatus(SAVE_STATUSES.noAuth)); // Shouldn't get here, but...
      return;
    }

    // Update UI while we're waiting for the API
    dispatch(setSaveFormStatus(SAVE_STATUSES.pending));

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
        dispatch(setSaveFormStatus(SAVE_STATUSES.success));
      } else {
        // TODO: If they've sat on the page long enough for their token to expire
        //  and try to save, tell them their session expired and they need to log
        //  back in and try again. Unfortunately, this means they'll lose all
        //  their information.
        if (res.status === 401) {
          dispatch(setSaveFormStatus(SAVE_STATUSES.noAuth));
        } else {
          dispatch(setSaveFormStatus(SAVE_STATUSES.failure));
        }
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
  return dispatch => {
    const userToken = sessionStorage.userToken;
    // If we don't have a userToken, fail safely
    if (!userToken) {
      dispatch(setFetchFormStatus(LOAD_STATUSES.noAuth)); // Shouldn't get here, but just in case
      return;
    }

    // Update UI while we're waiting for the API
    dispatch(setFetchFormStatus(LOAD_STATUSES.pending));

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
    }).then((resBody) => {  // eslint-disable-line consistent-return
      // Just in case something funny happens where the json returned isn't an object as expected
      if (typeof resBody !== 'object') {
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
      // dispatch(setData(formData));
      dispatch(setInProgressForm({ formData, metadata: resBody.metadata }));
    }).catch((status) => {
      let loadedStatus = status;
      // if res.json() has a parsing error, it'll reject with a SyntaxError
      if (status instanceof SyntaxError) {
        // TODO: Log this somehow...Sentry error?
        console.error('Could not parse response.', status); // eslint-disable-line no-console
        loadedStatus = LOAD_STATUSES.invalidData;
      }
      dispatch(setFetchFormStatus(loadedStatus));
    });
  };
}
