import { apiRequest } from 'platform/utilities/api';
import { ensureValidCSRFToken } from './utilities/ensureValidCSRFToken';
import { customTransformForSubmit } from './utilities';
import { buildEventData } from '../analytics/helpers';

/**
 *  submits form
 * @param {object} form form object from redux store
 * @param {object} formConfig main form config
 * @returns {Promise<object>} Response object
 */
export async function submit(form, formConfig) {
  const headers = { 'Content-Type': 'application/json' };
  const { body, data } = customTransformForSubmit(formConfig, form);
  const apiRequestOptions = {
    headers,
    body,
    method: 'POST',
    mode: 'cors',
  };

  const onSuccess = resp => {
    window.dataLayer.push({
      event: `${formConfig.trackingPrefix}-submission-successful`,
      ...buildEventData(data),
    });
    return resp;
  };

  const onFailure = respOrError => {
    if (respOrError instanceof Response && respOrError.status === 429) {
      const error = new Error(
        `${formConfig.trackingPrefix}_vets_throttled_error`,
      );
      error.extra = parseInt(respOrError.headers.get('x-ratelimit-reset'), 10);

      return Promise.reject(error);
    }
    return Promise.reject(respOrError);
  };

  const sendRequest = async () => {
    await ensureValidCSRFToken();
    return apiRequest(formConfig.submitUrl, apiRequestOptions).then(onSuccess);
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
          '686c-674 CSRF token invalid, retrying request',
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
          window.DD_LOGS.logger.error('686c-674 CSRF retry failed', {
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
