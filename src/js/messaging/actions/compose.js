export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_SUBJECT = 'SET_SUBJECT';


export function setCategory(value) {
  return {
    type: SET_CATEGORY,
    value
  };
}

export function setSubject(value) {
  return {
    type: SET_SUBJECT,
    value
  };
}
