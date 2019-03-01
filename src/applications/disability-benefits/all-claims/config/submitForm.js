import {
  transformForSubmit,
  recordEvent,
} from 'platform/forms-system/src/js/helpers';

const submitFormFor = eventName =>
  function submitForm(form, formConfig) {
    const body = formConfig.transformForSubmit
      ? formConfig.transformForSubmit(formConfig, form)
      : transformForSubmit(formConfig, form);

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
          resolve(results);
        } else {
          let error;
          if (req.status === 429) {
            error = new Error(`throttled_error: ${req.statusText}`);
            error.extra = parseInt(
              req.getResponseHeader('x-ratelimit-reset'),
              10,
            );
          } else {
            error = new Error(`server_error: ${req.statusText}`);
          }
          error.statusText = req.statusText;
          reject(error);
        }
      });

      req.addEventListener('error', () => {
        const error = new Error('client_error: Network request failed');
        error.statusText = req.statusText;
        reject(error);
      });

      req.addEventListener('abort', () => {
        const error = new Error('client_error: Request aborted');
        error.statusText = req.statusText;
        reject(error);
      });

      req.addEventListener('timeout', () => {
        const error = new Error('client_error: Request timed out');
        error.statusText = req.statusText;
        reject(error);
      });

      req.setRequestHeader('X-Key-Inflection', 'camel');
      req.setRequestHeader('Content-Type', 'application/json');

      req.send(body);
    });
  };

export default submitFormFor;
