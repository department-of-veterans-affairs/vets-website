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
  return fetch(`${environment.API_URL}/v0/vic/vic_submissions/${guid}`)
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(res);
    }).catch(res => {
      if (res instanceof Error) {
        Raven.captureException(res);
        Raven.captureMessage('vets_vic_poll_client_error');
      }

      return Promise.reject(res);
    });
}

const POLLING_INTERVAL = 1000;

function pollStatus(guid, onDone, onError) {
  setTimeout(() => {
    checkStatus(guid)
      .then((res) => {
        if (res.data.attributes.state === 'pending') {
          pollStatus(guid, onDone);
        } else {
          onDone(res);
        }
      })
      .catch(onError);
  }, POLLING_INTERVAL);
}

export function submit(form, formConfig) {
  const userToken = sessionStorage.userToken;
  const headers = {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'camel',
  };

  if (userToken) {
    headers.Authorization = `Token token=${userToken}`;
  }

  const formData = transformForSubmit(formConfig, form);
  const body = JSON.stringify({
    vicSubmission: {
      form: formData
    }
  });

  return new Promise((resolve, reject) => {
    fetch(`${environment.API_URL}/v0/vic/vic_submissions`, {
      method: 'POST',
      headers,
      body
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(res);
    }).then(resp => {
      const guid = resp.data.attributes.guid;
      pollStatus(guid, res => {
        resolve(res);
      }, error => {
        reject(error);
      });
    }).catch(reject);
  });
}
