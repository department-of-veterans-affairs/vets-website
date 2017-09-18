import Raven from 'raven-js';
import environment from '../helpers/environment.js';

export function removeFormApi(formId) {
  const userToken = sessionStorage.userToken;

  return fetch(`${environment.API_URL}/v0/in_progress_forms/${formId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // 'X-Key-Inflection': 'camel',
      Authorization: `Token token=${userToken}`
    },
  }).then((res) => {
    if (!res.ok) {
      return Promise.reject(res);
    }

    return Promise.resolve();
  }).catch(res => {
    if (res instanceof Error) {
      Raven.captureException(res);
      Raven.captureMessage('vets_sip_error_delete');
      return Promise.resolve();
    } else if (!res.ok) {
      Raven.captureMessage(`vets_sip_error_delete: ${res.statusText}`);
    }

    return Promise.reject(res);
  });
}
