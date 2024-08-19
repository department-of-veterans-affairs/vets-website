import * as Sentry from '@sentry/browser';
import { apiRequestWithResponse } from '../../utilities/api';
import {
  VA_FORM_IDS_SKIP_INFLECTION,
  VA_FORM_IDS_IN_PROGRESS_FORMS_API,
} from '../constants';
import environment from '../../utilities/environment';

export function inProgressApi(formId) {
  const apiUrl =
    VA_FORM_IDS_IN_PROGRESS_FORMS_API[formId] || '/v0/in_progress_forms/';
  return `${environment.API_URL}${apiUrl}${formId}`;
}

export function formApi(formId, optionalSettings) {
  const apiUrl = inProgressApi(formId);
  return apiRequestWithResponse(apiUrl, optionalSettings).then(response => {
    if (response.ok || response.status === 304) return response.json();
    return Promise.reject(response);
  });
}

export function removeFormApi(formId) {
  return formApi(formId, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
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
  const saveFormApiHeaders = {
    'X-Key-Inflection': 'camel',
    'Content-Type': 'application/json',
  };
  if (VA_FORM_IDS_SKIP_INFLECTION.includes(formId)) {
    delete saveFormApiHeaders['X-Key-Inflection'];
  }

  return formApi(formId, {
    method: 'PUT',
    headers: saveFormApiHeaders,
    body,
  });
}
