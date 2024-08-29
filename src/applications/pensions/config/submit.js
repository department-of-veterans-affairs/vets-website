import moment from 'moment';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

const usaPhoneKeys = ['phone', 'mobilePhone', 'dayPhone', 'nightPhone'];

export function replacer(key, value) {
  if (usaPhoneKeys.includes(key) && value?.length) {
    // Strip spaces, dashes, and parens from phone numbers
    return value.replace(/[^\d]/g, '');
  }

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
    pensionClaim: {
      form: formData,
    },
    // can’t use toISOString because we need the offset
    localTime: moment().format('Y-MM-DD[T]kk:mm:ssZZ'),
  });
}

export function submit(form, formConfig, apiPath = '/pensions/v0/claims') {
  const headers = { 'Content-Type': 'application/json' };
  const body = transform(formConfig, form);

  return apiRequest(`${environment.API_URL}${apiPath}`, {
    body,
    headers,
    method: 'POST',
    mode: 'cors',
  })
    .then(resp => {
      window.dataLayer.push({
        event: `${formConfig.trackingPrefix}-submission-successful`,
      });
      return resp.data.attributes;
    })
    .catch(respOrError => {
      if (respOrError instanceof Response && respOrError.status === 429) {
        const error = new Error('vets_throttled_error_pensions');
        error.extra = parseInt(
          respOrError.headers.get('x-ratelimit-reset'),
          10,
        );

        return Promise.reject(error);
      }
      return Promise.reject(respOrError);
    });
}
