export const UPDATE_COMPLETED_STATUS = 'UPDATE_COMPLETED_STATUS';
export const UPDATE_INCOMPLETE_STATUS = 'UPDATE_INCOMPLETE_STATUS';
export const UPDATE_REVIEW_STATUS = 'UPDATE_REVIEW_STATUS';
export const UPDATE_VERIFIED_STATUS = 'UPDATE_VERIFIED_STATUS';
export const UPDATE_SUBMISSION_STATUS = 'UPDATE_SUBMISSION_STATUS';
export const UPDATE_SUBMISSION_ID = 'UPDATE_SUBMISSION_ID';
export const UPDATE_SUBMISSION_TIMESTAMP = 'UPDATE_SUBMISSION_TIMESTAMP';

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
