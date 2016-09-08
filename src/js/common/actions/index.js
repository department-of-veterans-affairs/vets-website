export const UPDATE_LOGGEDIN_STATUS = 'UPDATE_LOGGEDIN_STATUS';
export const UPDATE_LOGIN_URL = 'UPDATE_LOGIN_URL';
export const UPDATE_PROFILE_FIELD = 'UPDATE_PROFILE_FIELD';
export const LOG_OUT = 'LOG_OUT';

export function updateLoggedInStatus(value) {
  return {
    type: UPDATE_LOGGEDIN_STATUS,
    value
  };
}

export function updateLogInUrl(value) {
  return {
    type: UPDATE_LOGIN_URL,
    value
  };
}

export function updateProfileField(propertyPath, value) {
  return {
    type: UPDATE_PROFILE_FIELD,
    propertyPath,
    value
  };
}

export function logOut() {
  return {
    type: LOG_OUT
  };
}
