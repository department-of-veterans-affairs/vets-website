export const ENSURE_FIELDS_INITIALIZED = 'ENSURE_FIELDS_INITIALIZED';
export const VETERAN_FIELD_UPDATE = 'VETERAN_FIELD_UPDATE';
export const UPDATE_COMPLETION_STATUS = 'UPDATE_COMPLETION_STATUS';
export const UPDATE_REVIEW_STATUS = 'UPDATE_REVIEW_STATUS';
export const UPDATE_SPOUSE_ADDRESS = 'UPDATE_SPOUSE_ADDRESS';
export const UPDATE_SUBMISSION_STATUS = 'UPDATE_SUBMISSION_STATUS';
export const CREATE_CHILD_INCOME_FIELDS = 'CREATE_CHILD_INCOME_FIELDS';

export function ensureFieldsInitialized(path) {
  return {
    type: ENSURE_FIELDS_INITIALIZED,
    path
  };
}

export function veteranUpdateField(propertyPath, value) {
  return {
    type: VETERAN_FIELD_UPDATE,
    propertyPath,
    value
  };
}

export function updateCompletionStatus(path) {
  return {
    type: UPDATE_COMPLETION_STATUS,
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

export function updateSpouseAddress(propertyPath, value) {
  return {
    type: UPDATE_SPOUSE_ADDRESS,
    propertyPath,
    value
  };
}

export function updateSubmissionStatus(field) {
  return {
    type: UPDATE_SUBMISSION_STATUS,
    field
  };
}

export function createChildIncomeFields(path) {
  return {
    type: CREATE_CHILD_INCOME_FIELDS,
    path
  };
}
