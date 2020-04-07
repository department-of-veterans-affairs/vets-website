import * as Sentry from '@sentry/browser';
import moment from 'moment';
import { transformForSubmit } from './helpers';
import recordEvent from 'platform/monitoring/record-event';
import { timeFromNow } from './utilities/date';
import localStorage from 'platform/utilities/storage/localStorage';

export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_DATA = 'SET_DATA';
export const SET_VIEWED_PAGES = 'SET_VIEWED_PAGES';
export const SET_PRE_SUBMIT = 'SET_PRE_SUBMIT';
export const SET_SUBMISSION = 'SET_SUBMISSION';
export const SET_SUBMITTED = 'SET_SUBMITTED';
export const OPEN_REVIEW_CHAPTER = 'OPEN_REVIEW_CHAPTER';
export const CLOSE_REVIEW_CHAPTER = 'CLOSE_REVIEW_CHAPTER';

export function closeReviewChapter(closedChapter, pageKeys = []) {
  return {
    type: CLOSE_REVIEW_CHAPTER,
    closedChapter,
    pageKeys,
  };
}

export function openReviewChapter(openedChapter) {
  return {
    type: OPEN_REVIEW_CHAPTER,
    openedChapter,
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    data,
  };
}

export function setEditMode(page, edit, index = null) {
  return {
    type: SET_EDIT_MODE,
    edit,
    page,
    index,
  };
}

// extra is used to pass other information (from a submission error or anything else)
// into the submission state object
export function setSubmission(field, value, extra = null) {
  return {
    type: SET_SUBMISSION,
    field,
    value,
    extra,
  };
}

export function setPreSubmit(preSubmitField, preSubmitAccepted) {
  return {
    type: SET_PRE_SUBMIT,
    preSubmitField,
    preSubmitAccepted,
  };
}

export function setSubmitted(response) {
  return {
    type: SET_SUBMITTED,
    response: typeof response.data !== 'undefined' ? response.data : response,
  };
}

export function setViewedPages(pageKeys) {
  return {
    type: SET_VIEWED_PAGES,
    pageKeys,
  };
}

export function submitToUrl(body, submitUrl, trackingPrefix, eventData) {
  // This item should have been set in any previous API calls
  const csrfTokenStored = localStorage.getItem('csrfToken');
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('POST', submitUrl);
    req.addEventListener('load', () => {
      if (req.status >= 200 && req.status < 300) {
        recordEvent({
          event: `${trackingPrefix}-submission-successful`,
          ...eventData,
        });
        // got this from the fetch polyfill, keeping it to be safe
        const responseBody =
          'response' in req ? req.response : req.responseText;
        const results = JSON.parse(responseBody);
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
        reject(error);
      }
    });

    req.addEventListener('error', () => {
      const error = new Error('vets_client_error: Network request failed');
      error.statusText = req.statusText;
      reject(error);
    });

    req.addEventListener('abort', () => {
      const error = new Error('vets_client_error: Request aborted');
      error.statusText = req.statusText;
      reject(error);
    });

    req.addEventListener('timeout', () => {
      const error = new Error('vets_client_error: Request timed out');
      error.statusText = req.statusText;
      reject(error);
    });

    req.setRequestHeader('X-Key-Inflection', 'camel');
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('X-CSRF-Token', csrfTokenStored);
    req.withCredentials = true;

    req.send(body);
  });
}

export function submitForm(formConfig, form) {
  const captureError = (error, errorType) => {
    Sentry.withScope(scope => {
      scope.setFingerprint([formConfig.trackingPrefix]);
      scope.setExtra('errorType', errorType);
      scope.setExtra('statusText', error.statusText);
      Sentry.captureException(error);
    });
    recordEvent({
      event: `${formConfig.trackingPrefix}-submission-failed${
        errorType.startsWith('client') ? '-client' : ''
      }`,
    });
  };

  return dispatch => {
    dispatch(setSubmission('status', 'submitPending'));
    recordEvent({
      event: `${formConfig.trackingPrefix}-submission`,
    });

    let promise;
    if (formConfig.submit) {
      promise = formConfig.submit(form, formConfig);
    } else {
      const body = formConfig.transformForSubmit
        ? formConfig.transformForSubmit(formConfig, form)
        : transformForSubmit(formConfig, form);

      promise = submitToUrl(
        body,
        formConfig.submitUrl,
        formConfig.trackingPrefix,
      );
    }

    return promise
      .then(resp => dispatch(setSubmitted(resp)))
      .catch(errorReceived => {
        // overly cautious
        const error =
          errorReceived instanceof Error
            ? errorReceived
            : new Error(errorReceived);
        const errorMessage = String(error.message);
        let errorType = 'clientError';
        if (errorMessage.startsWith('vets_throttled_error')) {
          errorType = 'throttledError';
        } else if (errorMessage.startsWith('vets_server_error')) {
          errorType = 'serverError';
        }
        captureError(error, errorType);
        dispatch(setSubmission('status', errorType, error.extra));
      });
  };
}

export function uploadFile(
  file,
  uiOptions,
  onProgress,
  onChange,
  onError,
  trackingPrefix,
) {
  return (dispatch, getState) => {
    if (file.size > uiOptions.maxSize) {
      onChange({
        name: file.name,
        errorMessage: 'File is too large to be uploaded',
      });

      onError();
      return null;
    }

    if (file.size < uiOptions.minSize) {
      onChange({
        name: file.name,
        errorMessage: 'File is too small to be uploaded',
      });

      onError();
      return null;
    }

    // we limit file types, but it’s not respected on mobile and desktop
    // users can bypass it without much effort
    if (
      !uiOptions.fileTypes.some(fileType =>
        file.name.toLowerCase().endsWith(fileType.toLowerCase()),
      )
    ) {
      onChange({
        name: file.name,
        errorMessage: 'File is not one of the allowed types',
      });

      onError();
      return null;
    }

    onChange({
      name: file.name,
      uploading: true,
    });

    const payload = uiOptions.createPayload(file, getState().form.formId);

    const req = new XMLHttpRequest();

    req.open('POST', uiOptions.fileUploadUrl);
    req.addEventListener('load', () => {
      if (req.status >= 200 && req.status < 300) {
        const body = 'response' in req ? req.response : req.responseText;
        const fileData = uiOptions.parseResponse(JSON.parse(body), file);

        recordEvent({ event: `${trackingPrefix}file-uploaded` });
        onChange(fileData);
      } else {
        let errorMessage = req.statusText;
        if (req.status === 429) {
          errorMessage = `You’ve reached the limit for the number of submissions we can accept at this time. Please try again in ${timeFromNow(
            moment.unix(
              parseInt(req.getResponseHeader('x-ratelimit-reset'), 10),
            ),
          )}.`;
        }

        onChange({
          name: file.name,
          errorMessage,
        });
        Sentry.captureMessage(`vets_upload_error: ${req.statusText}`);
        onError();
      }
    });

    req.addEventListener('error', () => {
      const errorMessage = 'Network request failed';
      onChange({
        name: file.name,
        errorMessage,
      });
      Sentry.withScope(scope => {
        scope.setExtra('statusText', req.statusText);
        Sentry.captureMessage(`vets_upload_error: ${errorMessage}`);
      });
      onError();
    });

    req.upload.addEventListener('progress', evt => {
      if (evt.lengthComputable && onProgress) {
        // setting this at 80, because there's some time after we get to 100%
        // where the backend is uploading to s3
        onProgress((evt.loaded / evt.total) * 80);
      }
    });

    req.setRequestHeader('X-Key-Inflection', 'camel');
    req.send(payload);

    return req;
  };
}
