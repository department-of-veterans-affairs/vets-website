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
  return dispatch => {
    dispatch(updateCompletedStatus('/1990/review-and-submit'));
    dispatch(updateSubmissionStatus('submitPending'));
    window.dataLayer.push({
      event: 'edu-submission',
    });
    fetch(`${environment.API_URL}/v0/education_benefits_claims`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel'
      },
      body: JSON.stringify({
        educationBenefitsClaim: {
          form: application
        }
      })
    })
    .then(res => {
      if (res.ok) {
        window.dataLayer.push({
          event: 'edu-submission-successful',
        });
        return res.json();
      }
      window.dataLayer.push({
        event: 'edu-submission-failed',
      });
      return Promise.reject(res.statusText);
    })
    .then(
      (resp) => dispatch(updateSubmissionDetails(resp.data.attributes)),
      () => dispatch(updateSubmissionStatus('error'))
    );
  };
}
