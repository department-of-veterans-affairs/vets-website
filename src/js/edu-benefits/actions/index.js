import { veteranToApplication } from '../utils/veteran';

import environment from '../../common/helpers/environment';

export const UPDATE_COMPLETED_STATUS = 'UPDATE_COMPLETED_STATUS';
export const UPDATE_INCOMPLETE_STATUS = 'UPDATE_INCOMPLETE_STATUS';
export const UPDATE_REVIEW_STATUS = 'UPDATE_REVIEW_STATUS';
export const UPDATE_VERIFIED_STATUS = 'UPDATE_VERIFIED_STATUS';
export const UPDATE_SUBMISSION_STATUS = 'UPDATE_SUBMISSION_STATUS';
export const UPDATE_SUBMISSION_ID = 'UPDATE_SUBMISSION_ID';
export const UPDATE_SUBMISSION_TIMESTAMP = 'UPDATE_SUBMISSION_TIMESTAMP';
export const UPDATE_SUBMISSION_DETAILS = 'UPDATE_SUBMISSION_DETAILS';
export const VETERAN_FIELD_UPDATE = 'VETERAN_FIELD_UPDATE';
export const ENSURE_FIELDS_INITIALIZED = 'ENSURE_FIELDS_INITIALIZED';

function getApiUrl() {
  if (window.VetsGov.api.url) {
    return window.VetsGov.api.url;
  }

  return environment.API_URL;
}

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

export function updateReviewStatus(path, value) {
  return {
    type: UPDATE_REVIEW_STATUS,
    path,
    value
  };
}

export function updateVerifiedStatus(path, value) {
  return {
    type: UPDATE_VERIFIED_STATUS,
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

export function submitForm(data) {
  const application = veteranToApplication(data);
  return dispatch => {
    dispatch(updateCompletedStatus('/review-and-submit'));
    dispatch(updateSubmissionStatus('submitPending'));
    fetch(`${getApiUrl()}/v0/education_benefits_claims`, {
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
        return res.json();
      }

      return Promise.reject(res.statusText);
    })
    .then(
      (resp) => dispatch(updateSubmissionDetails(resp.data.attributes)),
      () => dispatch(updateSubmissionStatus('error'))
    );
  };
}
