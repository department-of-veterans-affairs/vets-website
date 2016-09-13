export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_SUBJECT = 'SET_SUBJECT';
export const SET_SUBJECT_REQUIRED = 'SET_SUBJECT_REQUIRED';

export function setCategory(field) {
  return {
    type: SET_CATEGORY,
    field
  };
}

export function setSubject(field) {
  return {
    type: SET_SUBJECT,
    field
  };
}

export function setSubjectRequired(field) {
  const fieldstate = field;
  fieldstate.required = field.value === 'Other';

  return {
    type: SET_SUBJECT_REQUIRED,
    fieldstate
  };
}
