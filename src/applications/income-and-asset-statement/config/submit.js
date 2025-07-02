import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { format } from 'date-fns-tz';
import { cloneDeep } from 'lodash';

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

export function transformForSubmit(formConfig, form, replacerFn) {
  // Clone the form data to avoid mutating the original form
  // This is to avoid mutating the redux store directly
  const data = cloneDeep(form.data);

  const fields = Object.keys(data);
  fields.forEach(field => {
    // Remove fields that are undefined, null, or starts with 'view:'
    if (
      data[field] === undefined ||
      data[field] === null ||
      field.startsWith('view:')
    ) {
      delete data[field];
    }
  });

  return JSON.stringify(data, replacerFn);
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
