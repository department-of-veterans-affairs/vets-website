import environment from '../../../platform/utilities/environment';
import appendQuery from 'append-query';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';
import _ from 'lodash/fp';
import Raven from 'raven-js';
import recordEvent from '../../../platform/monitoring/record-event';
import conditionalStorage from '../../../platform/utilities/storage/conditionalStorage';

const searchInstitutionBaseUrl = `${environment.API_URL}/v0/gi/institutions/search`;

export function fetchInstitutions({ institutionQuery, page }) {
  const fetchUrl = appendQuery(searchInstitutionBaseUrl, {
    name: institutionQuery,
    page
  });

  return fetch(fetchUrl, {
    headers: {
      'X-Key-Inflection': 'camel'
    }
  })
    .then(res => res.json())
    .then(
      payload => ({ payload }),
      error => ({ error })
    );
}

export function transformInstitutionsForSchoolSelectField({ error, institutionQuery, payload = {} }) {
  if (error) {
    return { error };
  }

  const {
    data = [],
    meta
  } = payload;

  const institutionCount = meta.count;
  const pagesCount = Math.ceil(institutionCount / 10);
  const institutions = data.map(({ attributes }) => {
    const { city, country, facilityCode, name, state, zip } = attributes;

    return { city, country, facilityCode, name, state, zip };
  });

  return {
    institutionCount,
    institutionQuery,
    institutions,
    pagesCount
  };
}

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
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
          onDone(res.data.attributes.response);
        } else {
          // needs to start with this string to get the right message on the form
          throw new Error(`vets_server_error_edu: status ${res.data.attributes.state}`);
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

  const formData = transform(form, formConfig);
  const body = JSON.stringify({
    giBillFeedback: {
      form: formData
    }
  });

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
    pollStatus(guid, () => {
      recordEvent({
        event: `${formConfig.trackingPrefix}-submission-successful`,
      });
    }, () => Promise.reject(json));
  }).catch(respOrError => {
    Promise.reject(respOrError);
  });
}
