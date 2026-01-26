import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { format } from 'date-fns-tz';
import { ensureValidCSRFToken } from '../ensureValidCSRFToken';

const usaPhoneKeys = ['phone', 'mobilePhone', 'dayPhone', 'nightPhone'];

/**
 * Data replacer function to clean up form data before submission.
 * @param {string} key - The key of the current property being processed.
 * @param {any} value - The value of the current property being processed.
 * @returns {any} - The transformed value to be used in the JSON stringification.
 */
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

/**
 * Transforms the form data for submission.
 * @param {object} formConfig - The form configuration object
 * @param {object} form - The form object from Redux store
 * @returns {string} - The transformed form data as a JSON string
 */
export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form, replacer);
  return JSON.stringify({
    pensionClaim: {
      form: formData,
    },
    // can’t use toISOString because we need the offset
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
}

/**
 * Submits the form data to the specified API endpoint.
 * @param {object} form - The form object from Redux store
 * @param {object} formConfig - The form configuration object
 * @param {string} apiPath - The API endpoint path
 * @returns {Promise<object>} - The response data from the API
 */
export async function submit(
  form,
  formConfig,
  apiPath = '/pensions/v0/claims',
) {
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
    if (respOrError instanceof Response && respOrError.status === 429) {
      const error = new Error('vets_throttled_error_pensions');
      error.extra = parseInt(respOrError.headers.get('x-ratelimit-reset'), 10);

      return Promise.reject(error);
    }
    return Promise.reject(respOrError);
  };

  const sendRequest = async () => {
    await ensureValidCSRFToken();
    return apiRequest(
      `${environment.API_URL}${apiPath}`,
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
      if (window.DD_LOGS?.logger?.error) {
        window.DD_LOGS.logger.error(
          '21P-527EZ CSRF token invalid, retrying request',
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
        if (window.DD_LOGS?.logger?.error) {
          window.DD_LOGS.logger.error('21P-527EZ CSRF retry failed', {
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
