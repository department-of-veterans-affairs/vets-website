import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { format } from 'date-fns-tz';
import { cloneDeep } from 'lodash';
import { remapOtherVeteranFields } from './submit-helpers';
import { ensureValidCSRFToken } from '../ensureValidCSRFToken';

const disallowedFields = [
  'vaFileNumberLastFour',
  'veteranSsnLastFour',
  'otherVeteranFullName',
  'otherVeteranSocialSecurityNumber',
  'otherVaFileNumber',
  '_metadata', // old arrayBuilder metadata key
  'metadata', // arrayBuilder metadata key
  'isLoggedIn',
];

export function flattenRecipientName({ first, middle, last }) {
  // Filter out undefined values and join with spaces
  const parts = [first, middle, last].filter(part => !!part);

  // Join remaining parts with space and trim extra spaces
  return parts.join(' ').trim();
}

export function replacer(key, value) {
  // Clean up empty objects, which we have no reason to send
  if (typeof value === 'object' && value) {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }
  }

  // Clean up null values, which we have no reason to send
  if (value === null) {
    return undefined;
  }

  if (key === 'recipientName') {
    // If the value is an object, flatten it to a string
    if (typeof value === 'object' && value !== null) {
      return flattenRecipientName(value);
    }
    // If it's already a string, return it as is
    return value;
  }

  return value;
}

export function removeDisallowedFields(form) {
  const cleanedForm = cloneDeep(form);

  // Remove disallowed fields from the data
  disallowedFields.forEach(field => {
    if (cleanedForm.data[field] !== undefined) {
      delete cleanedForm.data[field];
    }
  });

  return cleanedForm;
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
  const clonedForm = cloneDeep(form);

  const { claimantType, isLoggedIn } = clonedForm.data;

  const shouldRemap = isLoggedIn !== true || claimantType !== 'VETERAN';

  if (shouldRemap) {
    // map otherVeteran* fields to veteran* fields for backend submission
    clonedForm.data = remapOtherVeteranFields(clonedForm.data);
  }

  // Remove disallowed fields from the form data as they will
  // get flagged by vets-api and the submission will be rejected
  const cleanedForm = removeDisallowedFields(clonedForm);

  const formData = transformForSubmit(formConfig, cleanedForm, replacer);

  return JSON.stringify({
    incomeAndAssetsClaim: {
      form: formData,
    },
    // can’t use toISOString because we need the offset
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
}

export async function submit(form, formConfig) {
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
    return resp.data;
  };

  const onFailure = respOrError => {
    if (respOrError instanceof Response && respOrError.status === 429) {
      const error = new Error('vets_throttled_error_income_and_assets');
      error.extra = parseInt(respOrError.headers.get('x-ratelimit-reset'), 10);

      return Promise.reject(error);
    }
    return Promise.reject(respOrError);
  };

  const sendRequest = async () => {
    await ensureValidCSRFToken();
    return apiRequest(
      `${environment.API_URL}/income_and_assets/v0/form0969`,
      apiRequestOptions,
    ).then(onSuccess);
  };

  return sendRequest().catch(async respOrError => {
    // if it's a CSRF error, clear CSRF and retry once
    const errorResponse = respOrError?.errors?.[0];
    if (
      errorResponse?.status === '403' &&
      errorResponse?.detail === 'Invalid Authenticity Token'
    ) {
      // Log the CSRF error before retrying
      if (window.DD_LOGS) {
        window.DD_LOGS.logger.error(
          '21P-0969 CSRF token invalid, retrying request',
          {
            formId: formConfig.formId,
            trackingPrefix: formConfig.trackingPrefix,
            inProgressFormId: form?.loadedData?.metadata?.inProgressFormId,
            errorCode: errorResponse?.code,
            errorStatus: errorResponse?.status,
            timestamp: new Date().toISOString(),
          },
        );
      }

      localStorage.setItem('csrfToken', '');
      return sendRequest().catch(retryError => {
        // Log the failed retry
        if (window.DD_LOGS) {
          window.DD_LOGS.logger.error('21P-0969 CSRF retry failed', {
            formId: formConfig.formId,
            trackingPrefix: formConfig.trackingPrefix,
            inProgressFormId: form?.loadedData?.metadata?.inProgressFormId,
            originalError: errorResponse,
            retryError: retryError?.errors?.[0],
            timestamp: new Date().toISOString(),
          });
        }
        return onFailure(retryError);
      });
    }

    // in other cases, handle error regularly
    return onFailure(respOrError);
  });
}
