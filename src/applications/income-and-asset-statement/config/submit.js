import { format } from 'date-fns-tz';

import { transformForSubmit } from '@department-of-veterans-affairs/platform-forms-system/helpers';
import { apiRequest } from 'platform/utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export function replacer(_, value) {
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
    incomeAndAssetsClaim: {
      form: formData,
    },
    // can’t use toISOString because we need the offset
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
}

export function submit(form, formConfig) {
  const headers = { 'Content-Type': 'application/json' };
  const body = transform(formConfig, form);

  return apiRequest(`${environment.API_URL}/income_and_assets/v0/form0969`, {
    body,
    headers,
    method: 'POST',
    mode: 'cors',
  });
}
