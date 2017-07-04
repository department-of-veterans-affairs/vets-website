import Raven from 'raven-js';
import _ from 'lodash/fp';
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


export function submitForm(formConfig, form) {
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  return dispatch => {
    dispatch(setSubmission('status', 'submitPending'));
    window.dataLayer.push({
      event: `${formConfig.trackingPrefix}-submission`,
    });

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel'
      },
      body
    };

    const userToken = sessionStorage.userToken;
    if (userToken) {
      fetchOptions.headers.Authorization = `Token token=${userToken}`;
    }

    return fetch(`${environment.API_URL}${formConfig.submitUrl}`, fetchOptions)
    .then(res => {
      if (res.ok) {
        window.dataLayer.push({
          event: `${formConfig.trackingPrefix}-submission-successful`,
        });
        return res.json();
      }

      return Promise.reject(new Error(`vets_server_error: ${res.statusText}`));
    })
    .then(resp => dispatch(setSubmitted(resp)))
    .catch(error => {
      // overly cautious
      const errorMessage = _.get('message', error);
      const clientError = errorMessage && !errorMessage.startsWith('vets_server_error');
      Raven.captureException(error, {
        extra: {
          clientError
        }
      });
      window.dataLayer.push({
        event: `${formConfig.trackingPrefix}-submission-failed${clientError ? '-client' : ''}`,
      });
      dispatch(setSubmission('status', clientError ? 'clientError' : 'error'));
    });
  };
}

export function uploadFile(file, filePath, uiOptions = {}) {
  return (dispatch, getState) => {
    if (file.size > uiOptions.maxSize) {
      dispatch(
        setData(_.set(filePath, {
          errorMessage: 'File is too large to be uploaded'
        }, getState().form.data))
      );

      return Promise.reject();
    }

    if (file.size < uiOptions.minSize) {
      dispatch(
        setData(_.set(filePath, {
          errorMessage: 'File is too small to be uploaded'
        }, getState().form.data))
      );

      return Promise.reject();
    }

    dispatch(
      setData(_.set(filePath, { uploading: true }, getState().form.data))
    );

    const payload = new FormData();
    payload.append('file', file);
    payload.append('form_id', getState().form.formId);

    return fetch(`${environment.API_URL}${uiOptions.endpoint}`, {
      method: 'POST',
      headers: {
        'X-Key-Inflection': 'camel'
      },
      body: payload
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      }

      return Promise.reject(new Error(`vets_upload_error: ${resp.statusText}`));
    }).then(fileInfo => {
      dispatch(
        setData(_.set(filePath, {
          name: fileInfo.data.attributes.name,
          size: fileInfo.data.attributes.size,
          confirmationCode: fileInfo.data.attributes.confirmationCode
        }, getState().form.data))
      );
    }).catch(error => {
      dispatch(
        setData(_.set(filePath, {
          errorMessage: error.message.replace('vets_upload_error: ', '')
        }, getState().form.data))
      );
      Raven.captureException(error);
    });
  };
}
