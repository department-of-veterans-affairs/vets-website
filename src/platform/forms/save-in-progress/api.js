import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { dataDogLogger } from '../../monitoring/Datadog/utilities';
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
  }).catch(error => {
    if (error instanceof Error) {
      if (environment.isLocalhost()) {
        // eslint-disable-next-line no-console
        console.warn('SiP delete error:', error);
      }
      dataDogLogger({
        message: 'vets_sip_error_delete',
        status: 'error',
        error,
      });
      return Promise.resolve();
    }

    dataDogLogger({
      message: `vets_sip_error_delete: ${error.statusText}`,
      status: 'error',
      attributes: { statusText: error.statusText },
    });
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
    body,
  });
}
