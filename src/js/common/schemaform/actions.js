import Raven from 'raven-js';
import _ from '../utils/data-utils';
import { transformForSubmit } from './helpers';
import environment from '../helpers/environment.js';

export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_DATA = 'SET_DATA';
export const SET_PRIVACY_AGREEMENT = 'SET_PRIVACY_AGREEMENT';
export const SET_SUBMISSION = 'SET_SUBMISSION';
export const SET_SUBMITTED = 'SET_SUBMITTED';

export function setData(data) {
  return {
    type: SET_DATA,
    data
  };
}

export function setEditMode(page, edit, index = null) {
  return {
    type: SET_EDIT_MODE,
    edit,
    page,
    index
  };
}

export function setSubmission(field, value) {
  return {
    type: SET_SUBMISSION,
    field,
    value
  };
}

export function setPrivacyAgreement(privacyAgreementAccepted) {
  return {
    type: SET_PRIVACY_AGREEMENT,
    privacyAgreementAccepted
  };
}

export function setSubmitted(response) {
  return {
    type: SET_SUBMITTED,
    response: typeof response.data !== 'undefined' ? response.data : response
  };
}

function submitToUrl(body, submitUrl, trackingPrefix) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('POST', `${environment.API_URL}${submitUrl}`);
    req.addEventListener('load', () => {
      if (req.status >= 200 && req.status < 300) {
        window.dataLayer.push({
          event: `${trackingPrefix}-submission-successful`,
        });
        // got this from the fetch polyfill, keeping it to be safe
        const responseBody = 'response' in req ? req.response : req.responseText;
        const results = JSON.parse(responseBody);
        resolve(results);
      } else {
        const error = new Error(`vets_server_error: ${req.statusText}`);
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

    const userToken = _.get('sessionStorage.userToken', window);
    if (userToken) {
      req.setRequestHeader('Authorization', `Token token=${userToken}`);
    }

    req.send(body);
  });
}

export function submitForm(formConfig, form) {
  const captureError = (error, clientError) => {
    Raven.captureException(error, {
      fingerprint: [formConfig.trackingPrefix, error.message],
      extra: {
        clientError,
        statusText: error.statusText
      }
    });
    window.dataLayer.push({
      event: `${formConfig.trackingPrefix}-submission-failed${clientError ? '-client' : ''}`,
    });
  };

  return dispatch => {
    dispatch(setSubmission('status', 'submitPending'));
    window.dataLayer.push({
      event: `${formConfig.trackingPrefix}-submission`,
    });

    let promise;
    if (formConfig.submit) {
      promise = formConfig.submit(form, formConfig);
    } else {
      const body = formConfig.transformForSubmit
        ? formConfig.transformForSubmit(formConfig, form)
        : transformForSubmit(formConfig, form);

      promise = submitToUrl(body, formConfig.submitUrl, formConfig.trackingPrefix);
    }

    return promise
      .then(resp => dispatch(setSubmitted(resp)))
      .catch(error => {
        // overly cautious
        const errorMessage = _.get('message', error);
        const clientError = errorMessage && !errorMessage.startsWith('vets_server_error');
        captureError(error, clientError);
        dispatch(setSubmission('status', clientError ? 'clientError' : 'error'));
      });
  };
}

export function uploadFile(file, uiOptions, onProgress, onChange, onError) {
  return (dispatch, getState) => {
    if (file.size > uiOptions.maxSize) {
      onChange({
        name: file.name,
        errorMessage: 'File is too large to be uploaded'
      });

      onError();
      return null;
    }

    if (file.size < uiOptions.minSize) {
      onChange({
        name: file.name,
        errorMessage: 'File is too small to be uploaded'
      });

      onError();
      return null;
    }

    // we limit file types, but it’s not respected on mobile and desktop
    // users can bypass it without much effort
    if (!uiOptions.fileTypes.some(fileType => file.name.toLowerCase().endsWith(fileType.toLowerCase()))) {
      onChange({
        name: file.name,
        errorMessage: 'File is not one of the allowed types'
      });

      onError();
      return null;
    }

    onChange({
      name: file.name,
      uploading: true
    });

    const payload = uiOptions.createPayload(file, getState().form.formId);

    const req = new XMLHttpRequest();

    req.open('POST', `${environment.API_URL}${uiOptions.endpoint}`);
    req.addEventListener('load', () => {
      if (req.status >= 200 && req.status < 300) {
        const body = 'response' in req ? req.response : req.responseText;
        const fileData = uiOptions.parseResponse(JSON.parse(body), file);
        onChange(fileData);
      } else {
        onChange({
          name: file.name,
          errorMessage: req.statusText
        });
        Raven.captureMessage(`vets_upload_error: ${req.statusText}`);
        onError();
      }
    });

    req.addEventListener('error', () => {
      const errorMessage = 'Network request failed';
      onChange({
        name: file.name,
        errorMessage
      });
      Raven.captureMessage(`vets_upload_error: ${errorMessage}`, {
        extra: {
          statusText: req.statusText
        }
      });
      onError();
    });

    req.addEventListener('abort', () => {
      onChange({
        name: file.name,
        errorMessage: 'Upload aborted'
      });
      Raven.captureMessage('vets_upload_error: Upload aborted');
      onError();
    });

    req.upload.addEventListener('progress', (evt) => {
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
