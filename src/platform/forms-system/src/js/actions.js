import * as Sentry from '@sentry/browser';
import recordEvent from 'platform/monitoring/record-event';
import localStorage from 'platform/utilities/storage/localStorage';
import { displayFileSize } from 'platform/utilities/ui/index';
import { FILE_UPLOAD_NETWORK_ERROR_MESSAGE } from 'platform/forms-system/src/js/constants';
import { infoTokenExists, refresh } from 'platform/utilities/oauth/utilities';
import { timeFromNow } from '../../../utilities/date';
import { transformForSubmit, handleSessionRefresh } from './helpers';

export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_DATA = 'SET_DATA';
export const SET_VIEWED_PAGES = 'SET_VIEWED_PAGES';
export const SET_PRE_SUBMIT = 'SET_PRE_SUBMIT';
export const SET_SUBMISSION = 'SET_SUBMISSION';
export const SET_SUBMITTED = 'SET_SUBMITTED';
export const OPEN_REVIEW_CHAPTER = 'OPEN_REVIEW_CHAPTER';
export const CLOSE_REVIEW_CHAPTER = 'CLOSE_REVIEW_CHAPTER';
export const TOGGLE_ALL_REVIEW_CHAPTERS = 'TOGGLE_ALL_REVIEW_CHAPTERS';
export const SET_FORM_ERRORS = 'SET_FORM_ERRORS';
export const SET_ITF = 'SET_ITF';

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

export function toggleAllReviewChapters(chapters) {
  return {
    type: TOGGLE_ALL_REVIEW_CHAPTERS,
    chapters,
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

// Intent to File data
export function setItf(data) {
  return {
    type: SET_ITF,
    data,
  };
}

export function submitToUrl(
  body,
  submitUrl,
  trackingPrefix,
  eventData,
  hasAttemptedTokenRefresh = false,
) {
  // This item should have been set in any previous API calls
  const csrfTokenStored = localStorage.getItem('csrfToken');
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.url = submitToUrl;
    req.open('POST', submitUrl);
    req.addEventListener('load', () => {
      handleSessionRefresh(req, csrfTokenStored);
      if (req.status >= 200 && req.status < 300) {
        recordEvent({
          event: `${trackingPrefix}-submission-successful`,
          ...eventData,
        });
        // got this from the fetch polyfill, keeping it to be safe
        const responseBody =
          'response' in req ? req.response : req.responseText;
        const results = JSON.parse(responseBody || '{}');
        resolve(results);
      } else if (req.status === 403 && !hasAttemptedTokenRefresh) {
        try {
          const errorResponse = JSON.parse(req.response);
          const errorMessage = errorResponse?.errors || '';
          const isTokenExpired = errorMessage.includes('token has expired');

          if (isTokenExpired && infoTokenExists()) {
            refresh({ type: sessionStorage.getItem('serviceName') })
              .then(() => {
                return submitToUrl(
                  body,
                  submitUrl,
                  trackingPrefix,
                  eventData,
                  true,
                );
              })
              .then(resolve)
              .catch(reject);
            return;
          }
        } catch (e) {
          // JSON parse error, fall through to reject
        }
        // If we couldn't refresh or it wasn't a token expiration, reject with error
        const error = new Error(`vets_server_error: ${req.statusText}`);
        error.statusText = req.statusText;
        reject(error);
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
  hasAttemptedTokenRefresh = false,
) {
  // This item should have been set in any previous API calls
  const csrfTokenStored = localStorage.getItem('csrfToken');
  return (dispatch, getState) => {
    // PDFs may have a different max size based on where it is being uploaded
    // (form 526 & claim status)
    const maxSize =
      (file.name.toLowerCase().endsWith('pdf') && uiOptions.maxPdfSize) ||
      uiOptions.maxSize;

    /* NOTE: this if block not needed for web-component patttern.
       Delete when legacy file input patterns have been removed */
    if (file.size > maxSize) {
      const fileSizeText = uiOptions?.maxSizeText || displayFileSize(maxSize);
      const fileTooBigErrorMessage =
        uiOptions?.fileTooBigErrorMessage ||
        'We couldn\u2019t upload your file because it\u2019s too large. ' +
          `File size must be less than ${fileSizeText}.`;
      const fileTooBigErrorAlert = uiOptions?.fileTooBigErrorAlert;
      const changePayload = {
        name: file.name,
        errorMessage: fileTooBigErrorMessage,
      };
      if (file.size) {
        changePayload.size = file.size;
      }
      if (file.lastModified) {
        changePayload.lastModified = file.lastModified;
      }
      if (fileTooBigErrorAlert) {
        changePayload.alert = fileTooBigErrorAlert;
      }
      onChange(changePayload);
      onError();
      return null;
    }

    if (file.size < uiOptions.minSize) {
      const fileSizeText =
        uiOptions?.minSizeText || displayFileSize(uiOptions.minSize);
      const fileTooSmallErrorMessage =
        'We couldn\u2019t upload your file because it\u2019s too small. ' +
        `Try uploading a file that\u2019s ${fileSizeText} or more.`;

      onChange({
        name: file.name,
        errorMessage: fileTooSmallErrorMessage,
      });

      onError();
      return null;
    }

    // we limit file types, but it’s not respected on mobile and desktop
    // users can bypass it without much effort
    const anyImage =
      uiOptions.fileTypes[0] === 'image/*' && file.type.startsWith('image/');
    /* NOTE: this if block not needed for web-component patttern.
       Delete when legacy file input patterns have been removed */
    if (
      !uiOptions.fileTypes.some(fileType =>
        file.name.toLowerCase().endsWith(fileType.toLowerCase()),
      ) &&
      !anyImage
    ) {
      const allowedTypes = uiOptions.fileTypes.reduce(
        (accumulator, fileType, index, array) => {
          if (index === 0) return `.${fileType}`;

          const seperator = index < array.length - 1 ? ',' : ', or';
          return `${accumulator}${seperator} .${fileType}`;
        },
        '',
      );

      const fileTypeErrorMessage =
        'We couldn\u2019t upload your file because we can\u2019t accept this type ' +
        `of file. Please make sure the file is a ${allowedTypes} file and try again.`;

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
    req.url = uiOptions.fileUploadUrl;
    req.open('POST', req.url);
    req.addEventListener('load', () => {
      handleSessionRefresh(req, csrfTokenStored);
      if (req.status >= 200 && req.status < 300) {
        const body = 'response' in req ? req.response : req.responseText;
        const fileData = uiOptions.parseResponse(JSON.parse(body), file);
        recordEvent({ event: `${trackingPrefix}file-uploaded` });
        onChange({
          ...fileData,
          isEncrypted: !!password,
        });
      } else if (req.status === 403 && !hasAttemptedTokenRefresh) {
        let errorResponse;
        try {
          errorResponse = JSON.parse(req.response);
          const errorMessage = errorResponse?.errors || '';
          const isTokenExpired = errorMessage.includes('token has expired');

          if (isTokenExpired && infoTokenExists()) {
            refresh({ type: sessionStorage.getItem('serviceName') }).then(
              () => {
                return uploadFile(
                  file,
                  uiOptions,
                  onProgress,
                  onChange,
                  onError,
                  trackingPrefix,
                  password,
                  true,
                )(dispatch, getState);
              },
            );
          }
        } catch (e) {
          // fall through to show error
        }
      } else {
        const fileObj = { file, name: file.name, size: file.size };
        let errorMessage = req.statusText;
        try {
          // detail contains a better error message
          errorMessage =
            JSON.parse(req?.response)?.errors?.[0]?.detail ?? errorMessage;
        } catch (error) {
          // intentionally empty
        }
        if (req.status === 429) {
          errorMessage = `You’ve reached the limit for the number of submissions we can accept at this time. Please try again in ${timeFromNow(
            new Date(
              parseInt(req.getResponseHeader('x-ratelimit-reset'), 10) * 1000,
            ),
          )}.`;
        }
        if (password) {
          onChange({
            ...fileObj,
            errorMessage,
            isEncrypted: true,
          });
        } else {
          onChange({ ...fileObj, errorMessage });
        }
        Sentry.captureMessage(`vets_upload_error: ${errorMessage}`);
        onError();
      }
    });

    req.addEventListener('error', () => {
      const errorMessage =
        uiOptions?.fileUploadNetworkErrorMessage ||
        FILE_UPLOAD_NETWORK_ERROR_MESSAGE;
      const errorAlert = uiOptions?.fileUploadNetworkErrorAlert;
      if (password) {
        onChange({
          file, // return file object to allow resubmit
          name: file.name,
          errorMessage,
        });
      } else {
        const changePayload = {
          file,
          name: file.name,
          errorMessage,
          ...(errorAlert && { alert: errorAlert }),
        };
        onChange(changePayload); // return file object to allow resubmit
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
