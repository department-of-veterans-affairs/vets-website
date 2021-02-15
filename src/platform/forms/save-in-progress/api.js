import * as Sentry from '@sentry/browser';
import recordEvent from '../../monitoring/record-event';
import localStorage from '../../utilities/storage/localStorage';
import { fetchAndUpdateSessionExpiration as fetch } from '../../utilities/api';
import { sanitizeForm, inProgressApi } from '../helpers';
import { VA_FORM_IDS_SKIP_INFLECTION } from '../constants';

export function removeFormApi(formId) {
  const csrfTokenStored = localStorage.getItem('csrfToken');
  const apiUrl = inProgressApi(formId);
  return fetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
      'X-CSRF-Token': csrfTokenStored,
    },
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      return Promise.resolve();
    })
    .catch(res => {
      if (res instanceof Error) {
        Sentry.captureException(res);
        Sentry.captureMessage('vets_sip_error_delete');
        return Promise.resolve();
      } else if (!res.ok) {
        Sentry.captureMessage(`vets_sip_error_delete: ${res.statusText}`);
      }

      return Promise.reject(res);
    });
}

export function saveFormApi(
  formId,
  formData,
  version,
  returnUrl,
  savedAt,
  trackingPrefix,
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
  const csrfTokenStored = localStorage.getItem('csrfToken');
  const apiUrl = inProgressApi(formId);
  const saveFormApiHeaders = {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'camel',
    'Source-App-Name': window.appName,
    'X-CSRF-Token': csrfTokenStored,
  };
  if (VA_FORM_IDS_SKIP_INFLECTION.includes(formId)) {
    delete saveFormApiHeaders['X-Key-Inflection'];
  }

  return fetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: saveFormApiHeaders,
    body,
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(res);
    })
    .then(result => {
      recordEvent({
        event: `${trackingPrefix}sip-form-saved`,
      });

      return Promise.resolve(result);
    })
    .catch(resOrError => {
      if (resOrError.status === 401) {
        recordEvent({
          event: `${trackingPrefix}sip-form-save-signed-out`,
        });
      } else if (resOrError instanceof Response) {
        recordEvent({
          event: `${trackingPrefix}sip-form-save-failed`,
        });
      } else {
        Sentry.captureException(resOrError);
        Sentry.withScope(scope => {
          scope.setExtra('form', sanitizeForm(formData));
          Sentry.captureMessage('vets_sip_error_save');
        });
        recordEvent({
          event: `${trackingPrefix}sip-form-save-failed-client`,
        });
      }

      return Promise.reject(resOrError);
    });
}
