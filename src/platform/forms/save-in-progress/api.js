import * as Sentry from '@sentry/browser';
import { apiRequest } from '../../utilities/api';
import { inProgressApi } from '../helpers';
import { VA_FORM_IDS_SKIP_INFLECTION } from '../constants';

export function removeFormApi(formId) {
  const apiUrl = inProgressApi(formId);
  return apiRequest(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    includeResponseInFailureRejection: true,
  }).catch(error => {
    if (error instanceof Error) {
      Sentry.captureException(error);
      Sentry.captureMessage('vets_sip_error_delete');
      return Promise.resolve();
    }

    Sentry.captureMessage(`vets_sip_error_delete: ${error.statusText}`);
    return Promise.reject(error);
  });
}

export function saveFormApi(
  formId,
  formData,
  version,
  returnUrl,
  savedAt,
  submission,
) {
  const body = JSON.stringify({
    metadata: {
      version,
      returnUrl,
      savedAt,
      submission,
    },
    formData,
  });
  const apiUrl = inProgressApi(formId);
  const saveFormApiHeaders = {
    'X-Key-Inflection': 'camel',
    'Content-Type': 'application/json',
  };
  if (VA_FORM_IDS_SKIP_INFLECTION.includes(formId)) {
    delete saveFormApiHeaders['X-Key-Inflection'];
  }

  return apiRequest(apiUrl, {
    method: 'PUT',
    headers: saveFormApiHeaders,
    includeResponseInFailureRejection: true,
    body,
  });
}
