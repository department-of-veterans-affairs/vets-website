export const LOG_OUT = 'LOG_OUT';
export const UPDATE_VERIFY_URL = 'UPDATE_VERIFY_URL';

export function logOut() {
  return {
    type: LOG_OUT
  };
}

export function updateVerifyUrl(value) {
  return {
    type: UPDATE_VERIFY_URL,
    value
  };
}
