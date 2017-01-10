export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_DATA = 'SET_DATA';
export const SET_VALID = 'SET_VALID';
export const SET_PRIVACY_AGREEMENT = 'SET_PRIVACY_AGREEMENT';
export const SET_SUBMISSION = 'SET_SUBMISSION';

export function setData(page, data) {
  return {
    type: SET_DATA,
    data,
    page
  };
}

export function setEditMode(page, edit) {
  return {
    type: SET_EDIT_MODE,
    edit,
    page
  };
}

export function setSubmission(field, value) {
  return {
    type: SET_SUBMISSION,
    field,
    value
  };
}
