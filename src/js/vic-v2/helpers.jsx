import _ from 'lodash/fp';
import Raven from 'raven-js';
import environment from '../common/helpers/environment.js';
import { transformForSubmit } from '../common/schemaform/helpers';

export function prefillTransformer(pages, formData, metadata) {
  if (formData && formData.serviceBranches) {
    // Mostly we'll be getting branch lists of one or two branches, creating a Set seems like overkill
    const allowedBranches = pages.veteranInformation.schema.properties.serviceBranch.enum;
    const validUserBranches = formData.serviceBranches.filter(branch => allowedBranches.includes(branch));

    const newData = _.unset('serviceBranches', formData);
    if (validUserBranches.length > 0) {
      newData.serviceBranch = validUserBranches[0];
      return {
        metadata,
        formData: newData,
        pages: _.set('veteranInformation.schema.properties.serviceBranch.enum', validUserBranches, pages)
      };
    }

    return {
      metadata,
      formData: newData,
      pages
    };
  }

  return {
    metadata,
    formData,
    pages
  };
}

function checkStatus(guid) {
  const userToken = window.sessionStorage.userToken;
  const headers = {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'camel',
  };

  if (userToken) {
    headers.Authorization = `Token token=${userToken}`;
  }
  return fetch(`${environment.API_URL}/v0/vic/vic_submissions/${guid}`, {
    headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(res);
    }).catch(res => {
      if (res instanceof Error) {
        Raven.captureException(res);
        Raven.captureMessage('vets_vic_poll_client_error');

        // keep polling because we know they submitted earlier
        // and this is likely a network error
        return Promise.resolve();
      }

      // if we get here, it's likely that we hit a server error
      return Promise.reject(res);
    });
}

const POLLING_INTERVAL = 1000;

function pollStatus(guid, onDone, onError) {
  setTimeout(() => {
    checkStatus(guid)
      .then(res => {
        if (!res || res.data.attributes.state === 'pending') {
          pollStatus(guid, onDone, onError);
        } else if (res.data.attributes.state === 'success') {
          onDone(res.data.attributes.response);
        } else {
        // needs to start with this string to get the right message on the form
          throw new Error(`vets_server_error_vic: status ${res.data.attributes.state}`);
        }
      })
      .catch(onError);
  }, window.VetsGov.pollTimeout || POLLING_INTERVAL);
}

export function fetchPreview(id) {
  const userToken = window.sessionStorage.userToken;
  const headers = {
    'X-Key-Inflection': 'camel',
    Authorization: `Token token=${userToken}`
  };

  return fetch(`${environment.API_URL}/v0/vic/profile_photo_attachments/${id}`, {
    headers
  }).then(resp => {
    if (resp.ok) {
      return resp.blob();
    }

    return new Error(resp.responseText);
  }).then(blob => {
    return window.URL.createObjectURL(blob);
  });
}

export function submit(form, formConfig) {
  const userToken = window.sessionStorage.userToken;
  const headers = {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'camel',
  };

  if (userToken) {
    headers.Authorization = `Token token=${userToken}`;
  }

  const formData = transformForSubmit(formConfig, _.unset('data.verified', form));
  const body = JSON.stringify({
    vicSubmission: {
      form: formData
    }
  });

  return new Promise((resolve, reject) => {
    let photo = form.data.photo.file;
    let photoPromise;

    if (photo instanceof Blob) {
      photoPromise = Promise.resolve(window.URL.createObjectURL(photo));
    } else {
      photoPromise = fetchPreview(form.data.photo.confirmationCode);
    }

    photoPromise.catch(err => {
      // It's possible that we don't have the photo yet but there's nothing we can do about
      // that. We will not show the card preview, but let the submit go through in that case,
      // since the backend will wait for the photo to process
      Raven.captureException(err);
      return null;
    }).then(photoSrc => {
      photo = photoSrc;
      return fetch(`${environment.API_URL}/v0/vic/vic_submissions`, {
        method: 'POST',
        headers,
        body
      });
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(res);
    }).then(resp => {
      const guid = resp.data.attributes.guid;
      pollStatus(guid, response => {
        resolve(_.set('photo', photo, response));
      }, reject);
    })
      .catch(reject);
  });
}

export function hasSavedForm(savedForms, formID) {
  return savedForms.some(({ form }) => form === formID);
}

