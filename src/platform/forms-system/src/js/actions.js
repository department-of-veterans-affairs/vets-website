import * as Sentry from '@sentry/browser';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';
import localStorage from 'platform/utilities/storage/localStorage';
import { displayFileSize } from 'platform/utilities/ui/index';
import { FILE_UPLOAD_NETWORK_ERROR_MESSAGE } from 'platform/forms-system/src/js/constants';
import { timeFromNow } from './utilities/date';
import { transformForSubmit } from './helpers';

export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_DATA = 'SET_DATA';
export const SET_VIEWED_PAGES = 'SET_VIEWED_PAGES';
export const SET_PRE_SUBMIT = 'SET_PRE_SUBMIT';
export const SET_SUBMISSION = 'SET_SUBMISSION';
export const SET_SUBMITTED = 'SET_SUBMITTED';
export const OPEN_REVIEW_CHAPTER = 'OPEN_REVIEW_CHAPTER';
export const CLOSE_REVIEW_CHAPTER = 'CLOSE_REVIEW_CHAPTER';
export const SET_FORM_ERRORS = 'SET_FORM_ERRORS';

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
export function setSubmission(field, value, errorMessage = null, extra = null) {
  return {
    type: SET_SUBMISSION,
    field,
    value,
    errorMessage, // include errorMessage in form.submission
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

export function setFormErrors(errors) {
  // See platform/forms-system/src/js/utilities/data/reduceErrors.js for
  // data structure
  return {
    type: SET_FORM_ERRORS,
    data: errors,
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
    req.setRequestHeader('Source-App-Name', window.appName);
    req.withCredentials = true;

    req.send(body);
  });
}

export function submitForm(formConfig, form) {
  const inProgressFormId = form.loadedData?.metadata?.inProgressFormId;
  const captureError = (error, errorType) => {
    Sentry.withScope(scope => {
      scope.setFingerprint([formConfig.trackingPrefix]);
      scope.setExtra('errorType', errorType);
      scope.setExtra('statusText', error.statusText);
      scope.setExtra('inProgressFormId', inProgressFormId);
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
        dispatch(setSubmission('status', errorType, errorMessage, error.extra));
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
  password,
  enableShortWorkflow,
) {
  // This item should have been set in any previous API calls
  const csrfTokenStored = localStorage.getItem('csrfToken');
  return (dispatch, getState) => {
    // PDFs may have a different max size based on where it is being uploaded
    // (form 526 & claim status)
    const maxSize =
      (file.name.toLowerCase().endsWith('pdf') && uiOptions.maxPdfSize) ||
      uiOptions.maxSize;

    if (file.size > maxSize) {
      const fileSizeText = uiOptions?.maxSizeText || displayFileSize(maxSize);
      const fileTooBigErrorMessage = enableShortWorkflow
        ? 'We couldn\u2019t upload your file because it\u2019s too big. ' +
          `Please make sure the file is ${fileSizeText} or less and try again.`
        : 'We couldn\u2019t upload your file because it\u2019s too large. ' +
          `File size must be less than ${fileSizeText}.`;

      onChange({
        name: file.name,
        errorMessage: fileTooBigErrorMessage,
      });

      onError();
      return null;
    }

    if (file.size < uiOptions.minSize) {
      const fileSizeText =
        uiOptions?.minSizeText || displayFileSize(uiOptions.minSize);
      const fileTooSmallErrorMessage = enableShortWorkflow
        ? 'We couldn\u2019t upload your file because it\u2019s too small. ' +
          `Please make sure the file is ${fileSizeText} or more and try again.`
        : 'We couldn\u2019t upload your file because it\u2019s too small. ' +
          `Please delete this file. Try uploading a file that\u2019s ${fileSizeText} or more.`;

      onChange({
        name: file.name,
        errorMessage: fileTooSmallErrorMessage,
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
      const allowedTypes = uiOptions.fileTypes.reduce(
        (accumulator, fileType, index, array) => {
          if (index === 0) return `.${fileType}`;

          const seperator = index < array.length - 1 ? ',' : ', or';
          return `${accumulator}${seperator} .${fileType}`;
        },
        '',
      );

      const fileTypeErrorMessage = enableShortWorkflow
        ? 'We couldn\u2019t upload your file because we can\u2019t accept this type ' +
          `of file. Please make sure the file is a ${allowedTypes} file and try again.`
        : 'We couldn\u2019t upload your file because we can\u2019t accept this type ' +
          `of file. Please delete the file. Then try again with a ${allowedTypes} file.`;

      onChange({
        name: file.name,
        errorMessage: fileTypeErrorMessage,
      });

      onError();
      return null;
    }
    if (password) {
      onChange({ name: file.name, uploading: true, password });
    } else {
      onChange({ name: file.name, uploading: true });
    }

    const payload = uiOptions.createPayload(
      file,
      getState().form.formId,
      password,
    );

    const req = new XMLHttpRequest();

    req.open('POST', uiOptions.fileUploadUrl);
    req.addEventListener('load', () => {
      if (req.status >= 200 && req.status < 300) {
        const body = 'response' in req ? req.response : req.responseText;
        const fileData = uiOptions.parseResponse(JSON.parse(body), file);
        recordEvent({ event: `${trackingPrefix}file-uploaded` });
        onChange({ ...fileData, size: file.size, isEncrypted: !!password });
      } else {
        let errorMessage = req.statusText;
        try {
          // detail contains a better error message
          errorMessage = JSON.parse(req?.response)?.errors?.[0]?.detail;
        } catch (error) {
          // intentionally empty
        }
        if (req.status === 429) {
          errorMessage = `You’ve reached the limit for the number of submissions we can accept at this time. Please try again in ${timeFromNow(
            moment.unix(
              parseInt(req.getResponseHeader('x-ratelimit-reset'), 10),
            ),
          )}.`;
        }

        if (password) {
          onChange({
            file, // return file object to allow resubmit
            name: file.name,
            size: file.size,
            errorMessage,
            isEncrypted: true,
          });
        } else {
          onChange({ name: file.name, size: file.size, errorMessage });
        }
        Sentry.captureMessage(`vets_upload_error: ${errorMessage}`);
        onError();
      }
    });

    req.addEventListener('error', () => {
      const errorMessage = enableShortWorkflow
        ? FILE_UPLOAD_NETWORK_ERROR_MESSAGE
        : 'We\u2019re sorry. We had a connection problem. Please delete the file and try again.';

      if (password) {
        onChange({
          file, // return file object to allow resubmit
          name: file.name,
          errorMessage,
          password: file.password,
        });
      } else {
        onChange({ file, name: file.name, errorMessage }); // return file object to allow resubmit
      }
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
    req.setRequestHeader('X-CSRF-Token', csrfTokenStored);
    req.setRequestHeader('Source-App-Name', window.appName);
    req.withCredentials = true;
    req.send(payload);

    return req;
  };
}
