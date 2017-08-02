import Raven from 'raven-js';
import _ from 'lodash/fp';
import { veteranToApplication } from '../utils/veteran';

import environment from '../../../common/helpers/environment';

export const UPDATE_COMPLETED_STATUS = 'UPDATE_COMPLETED_STATUS';
export const UPDATE_INCOMPLETE_STATUS = 'UPDATE_INCOMPLETE_STATUS';
export const UPDATE_EDIT_STATUS = 'UPDATE_EDIT_STATUS';
export const UPDATE_SUBMISSION_STATUS = 'UPDATE_SUBMISSION_STATUS';
export const UPDATE_SUBMISSION_ID = 'UPDATE_SUBMISSION_ID';
export const UPDATE_SUBMISSION_TIMESTAMP = 'UPDATE_SUBMISSION_TIMESTAMP';
export const UPDATE_SUBMISSION_DETAILS = 'UPDATE_SUBMISSION_DETAILS';
export const VETERAN_FIELD_UPDATE = 'VETERAN_FIELD_UPDATE';
export const ENSURE_FIELDS_INITIALIZED = 'ENSURE_FIELDS_INITIALIZED';
export const SET_ATTEMPTED_SUBMIT = 'SET_ATTEMPTED_SUBMIT';

export function ensurePageInitialized(page) {
  return (dispatch, getState) => {
    return dispatch({
      type: ENSURE_FIELDS_INITIALIZED,
      fields: getState().uiState.pages[page].fields,
    });
  };
}

export function ensureFieldsInitialized(fields, parentNode) {
  return {
    type: ENSURE_FIELDS_INITIALIZED,
    fields,
    parentNode
  };
}

export function veteranUpdateField(propertyPath, value) {
  return {
    type: VETERAN_FIELD_UPDATE,
    propertyPath,
    value
  };
}

export function updateCompletedStatus(path) {
  return {
    type: UPDATE_COMPLETED_STATUS,
    path
  };
}

export function updateIncompleteStatus(path) {
  return {
    type: UPDATE_INCOMPLETE_STATUS,
    path
  };
}

export function updateEditStatus(path, value) {
  return {
    type: UPDATE_EDIT_STATUS,
    path,
    value
  };
}

export function updateSubmissionStatus(value) {
  return {
    type: UPDATE_SUBMISSION_STATUS,
    value
  };
}

export function updateSubmissionId(value) {
  return {
    type: UPDATE_SUBMISSION_ID,
    value
  };
}

export function updateSubmissionTimestamp(value) {
  return {
    type: UPDATE_SUBMISSION_TIMESTAMP,
    value
  };
}

export function updateSubmissionDetails(attributes) {
  return {
    type: UPDATE_SUBMISSION_DETAILS,
    attributes
  };
}

export function setAttemptedSubmit() {
  return {
    type: SET_ATTEMPTED_SUBMIT
  };
}

export function submitForm(data) {
  const application = veteranToApplication(data);

  const captureError = (error, clientError) => {
    Raven.captureException(error, {
      extra: {
        clientError,
        statusText: error.statusText
      }
    });
    window.dataLayer.push({
      event: `edu-submission-failed${clientError ? '-client' : ''}`,
    });
  };

  return dispatch => {
    dispatch(updateCompletedStatus('/1990/review-and-submit'));
    dispatch(updateSubmissionStatus('submitPending'));
    window.dataLayer.push({
      event: 'edu-submission',
    });

    const promise = new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('POST', `${environment.API_URL}/v0/education_benefits_claims`);
      req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 300) {
          window.dataLayer.push({
            event: 'edu-submission-successful'
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

      req.send(JSON.stringify({
        educationBenefitsClaim: {
          form: application
        }
      }));
    });

    return promise
      .then((resp) => dispatch(updateSubmissionDetails(resp.data.attributes)))
      .catch(error => {
        // overly cautious
        const errorMessage = _.get('message', error);
        const clientError = errorMessage && !errorMessage.startsWith('vets_server_error');
        captureError(error, clientError);
        dispatch(updateSubmissionStatus(clientError ? 'clientError' : 'error'));
      });
  };
}
