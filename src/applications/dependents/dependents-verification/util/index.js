import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import recordEvent from 'platform/monitoring/record-event';
import { hideDependentsWarning } from '../../shared/utils';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    dependentsVerificationClaim: {
      form: formData,
    },
  });
}

const fetchNewCSRFToken = async () => {
  const url = '/v0/maintenance_windows';
  recordEvent({
    event: 'dependents-verification-fetch-csrf-token-empty',
  });
  return apiRequest(`${environment.API_URL}${url}`, { method: 'HEAD' })
    .then(() => {
      recordEvent({
        event: 'dependents-verification-fetch-csrf-token-success',
      });
    })
    .catch(() => {
      recordEvent({
        event: 'dependents-verification-fetch-csrf-token-failure',
      });
    });
};

export const ensureValidCSRFToken = async () => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) {
    await fetchNewCSRFToken();
  } else {
    recordEvent({
      event: 'dependents-verification-fetch-csrf-token-present',
    });
  }
};

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
    hideDependentsWarning();
    window.dataLayer.push({
      event: `${formConfig.trackingPrefix}-submission-successful`,
    });
    return resp.data.attributes;
  };

  const onFailure = respOrError => {
    if (respOrError instanceof Response && respOrError.status === 429) {
      const error = new Error('vets_throttled_error_dependents_verification');
      error.extra = parseInt(respOrError.headers.get('x-ratelimit-reset'), 10);

      return Promise.reject(error);
    }
    return Promise.reject(respOrError);
  };

  const sendRequest = async () => {
    await ensureValidCSRFToken();
    return apiRequest(
      `${environment.API_URL}/dependents_verification/v0/claims`,
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
      localStorage.setItem('csrfToken', '');
      return sendRequest().catch(onFailure);
    }

    // in other cases, handle error regularly
    return onFailure(respOrError);
  });
}
