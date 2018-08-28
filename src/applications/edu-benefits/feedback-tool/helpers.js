import appendQuery from 'append-query';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';
import Raven from 'raven-js';

import { apiRequest } from '../../../platform/utilities/api';
import environment from '../../../platform/utilities/environment';
import recordEvent from '../../../platform/monitoring/record-event';
import conditionalStorage from '../../../platform/utilities/storage/conditionalStorage';

export function fetchInstitutions({ institutionQuery, page, onDone, onError }) {
  const fetchUrl = appendQuery('/gi/institutions/search', {
    name: institutionQuery,
    include_address: true, // eslint-disable-line camelcase
    page
  });

  return apiRequest(
    fetchUrl,
    null,
    payload => onDone(payload),
    error => onError(error));
}

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    giBillFeedback: {
      form: formData
    }
  });
}

function checkStatus(guid) {
  const userToken = conditionalStorage().getItem('userToken');
  const headers = {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'camel',
  };

  if (userToken) {
    headers.Authorization = `Token token=${userToken}`;
  }
  return fetch(`${environment.API_URL}/v0/gi_bill_feedbacks/${guid}`, {
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
        Raven.captureMessage('vets_gi_bill_feedbacks_poll_client_error');

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
          onDone(res.data.attributes.parsedResponse);
        } else {
          // needs to start with this string to get the right message on the form
          throw new Error(`vets_server_error_gi_bill_feedbacks: status ${res.data.attributes.state}`);
        }
      })
      .catch(onError);
  }, window.VetsGov.pollTimeout || POLLING_INTERVAL);
}


export function submit(form, formConfig) {
  const userToken = conditionalStorage().getItem('userToken');
  const headers = {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'camel',
  };

  if (userToken) {
    headers.Authorization = `Token token=${userToken}`;
  }

  const body = transform(formConfig, form);
  return fetch(`${environment.API_URL}/v0/gi_bill_feedbacks`, {
    method: 'POST',
    headers,
    body
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }).then(json => {
    const guid = json.data.attributes.guid;
    return new Promise((resolve, reject) => {
      pollStatus(guid,
        response => {
          recordEvent({
            event: `${formConfig.trackingPrefix}-submission-successful`,
          });
          return resolve(response);
        }, error => reject(error));
    });
  }).catch(respOrError => {
    if (respOrError instanceof Response) {
      if (respOrError.status === 429) {
        const error = new Error('vets_throttled_error_gi_bill_feedbacks');
        error.extra = parseInt(respOrError.headers.get('x-ratelimit-reset'), 10);

        return Promise.reject(error);
      }
    }
    return Promise.reject(respOrError);
  });
}
