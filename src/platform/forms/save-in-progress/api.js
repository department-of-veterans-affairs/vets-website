// import * as Sentry from '@sentry/browser';
// import recordEvent from '../../monitoring/record-event';
import { apiRequest } from '../../utilities/api';
import { inProgressApi } from '../helpers';
import { VA_FORM_IDS_SKIP_INFLECTION } from '../constants';

export function removeFormApi(formId) {
  const apiUrl = inProgressApi(formId);
  return apiRequest(apiUrl, {
    method: 'DELETE',
  });
  // .then(result => {
  //   recordEvent({ event: `sip-form-delete-success` });
  //   return result;
  // })
  // .catch(error => {
  //   if (error instanceof Error) {
  //     Sentry.captureException(error);
  //     Sentry.captureMessage('vets_sip_error_delete');
  //   } else if (!error.ok) {
  //     Sentry.captureMessage(`vets_sip_error_delete: ${error.statusText}`);
  //   }
  //   return error;
  // });
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
  const apiUrl = inProgressApi(formId);
  const saveFormApiHeaders = {
    'X-Key-Inflection': 'camel',
  };
  if (VA_FORM_IDS_SKIP_INFLECTION.includes(formId)) {
    delete saveFormApiHeaders['X-Key-Inflection'];
  }

  return apiRequest(apiUrl, {
    method: 'PUT',
    headers: saveFormApiHeaders,
    body,
  });
  // .then(result => {
  //   recordEvent({ event: `${trackingPrefix}sip-form-saved` });
  //   return result;
  // })
  // .catch(error => {
  //   if (error.status === 401) {
  //     recordEvent({
  //       event: `${trackingPrefix}sip-form-save-signed-out`,
  //     });
  //   } else if (error instanceof Response) {
  //     recordEvent({ event: `${trackingPrefix}sip-form-save-failed` });
  //   } else {
  //     Sentry.captureException(error);
  //     Sentry.withScope(() => {
  //       Sentry.captureMessage('vets_sip_error_save');
  //     });
  //     recordEvent({
  //       event: `${trackingPrefix}sip-form-save-failed-client`,
  //     });
  //   }
  //   return error;
  // });
}
