import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { format } from 'date-fns-tz';
import {
  ensureValidCSRFToken,
  handleInvalidCSRF,
} from '../utils/ensureValidCSRFToken';

export function replacer(key, value) {
  // clean up empty objects, which we have no reason to send
  if (typeof value === 'object') {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }
  }

  return value;
}

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form, replacer);
  return JSON.stringify({
    burialClaim: {
      form: formData,
    },
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
}

export async function submit(form, formConfig) {
  await ensureValidCSRFToken();

  const headers = { 'Content-Type': 'application/json' };

  const body = transform(formConfig, form);
  const apiRequestOptions = {
    headers,
    body,
    method: 'POST',
    mode: 'cors',
  };

  const onSuccess = resp => {
    window.dataLayer.push({
      event: `${formConfig.trackingPrefix}-submission-successful`,
    });
    return resp.data.attributes;
  };

  const onFailure = respOrError => {
    handleInvalidCSRF(respOrError);

    if (respOrError instanceof Response && respOrError.status === 429) {
      const error = new Error('vets_throttled_error_burial');
      error.extra = parseInt(respOrError.headers.get('x-ratelimit-reset'), 10);

      return Promise.reject(error);
    }
    return Promise.reject(respOrError);
  };

  return apiRequest(
    `${environment.API_URL}${formConfig.submitUrl ?? '/v0/burial_claims'}`,
    apiRequestOptions,
  )
    .then(onSuccess)
    .catch(onFailure);
}
