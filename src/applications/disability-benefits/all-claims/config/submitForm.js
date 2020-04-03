import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import recordEvent from 'platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';
import localStorage from 'platform/utilities/storage/localStorage';

const submitFormFor = eventName =>
  function submitForm(form, formConfig, { mode } = {}) {
    const body = formConfig.transformForSubmit
      ? formConfig.transformForSubmit(formConfig, form)
      : transformForSubmit(formConfig, form);
    // This item should have been set in any previous API calls
    const csrfTokenStored = localStorage.getItem('csrfToken');

    let timer;
    // Reject promise timer set to 30 seconds; except while testing
    const rejectTime = mode === 'testing' ? 1 : 3e4;

    // Copied and pasted from USFS with a couple changes:
    // 1. Sets `withCredentials` to true
    // 2. Sends the Authorization header with the user token
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('POST', formConfig.submitUrl);

      req.withCredentials = true;

      req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 300) {
          recordEvent({ event: `${eventName}--submission-successful` });

          // got this from the fetch polyfill, keeping it to be safe
          const responseBody =
            'response' in req ? req.response : req.responseText;
          const results = JSON.parse(responseBody);
          clearTimeout(timer);
          resolve(results);
        } else {
          let error;
          if (req.status === 429) {
            error = new Error(`vets_throttled_error: ${req.statusText}`);
            error.extra = parseInt(
              req.getResponseHeader('x-ratelimit-reset'),
              10,
            );
          } else {
            error = new Error(`vets_server_error: ${req.statusText}`);
          }
          error.statusText = req.statusText;
          clearTimeout(timer);
          reject(error);
        }
      });

      req.addEventListener('error', () => {
        const error = new Error('client_error: Network request failed');
        error.statusText = req.statusText;
        clearTimeout(timer);
        reject(error);
      });

      req.addEventListener('abort', () => {
        const error = new Error('client_error: Request aborted');
        error.statusText = req.statusText;
        clearTimeout(timer);
        reject(error);
      });

      req.addEventListener('timeout', () => {
        const error = new Error('client_error: Request timed out');
        error.statusText = req.statusText;
        clearTimeout(timer);
        reject(error);
      });

      req.setRequestHeader('X-Key-Inflection', 'camel');
      req.setRequestHeader('Content-Type', 'application/json');
      req.setRequestHeader('X-CSRF-Token', csrfTokenStored);

      // Log an error after the timeout fires
      timer = setTimeout(() => {
        const error = new Error('client_error: Request taking too long');
        recordEvent({ event: `${eventName}--submission-taking-too-long` });
        Sentry.withScope(scope => {
          scope.setExtra('XMLHttpRequest', req);
          Sentry.captureMessage('Form 526: submission request taking too long');
        });
        if (mode !== 'testing') {
          // eslint-disable-next-line no-console
          console.log(req, form, JSON.parse(body));
        }
        reject(error);
      }, rejectTime);

      req.send(body);
    });
  };

export default submitFormFor;
