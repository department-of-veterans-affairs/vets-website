export const UPDATE_LOGGEDIN_STATUS = 'UPDATE_LOGGEDIN_STATUS';
export const UPDATE_LOGIN_URL = 'UPDATE_LOGIN_URL';
export const LOG_OUT = 'LOG_OUT';
export const UPDATE_SEARCH_HELP_USER_MENU = 'UPDATE_SEARCH_HELP_USER_MENU';

export function updateLoggedInStatus(value) {
  return {
    type: UPDATE_LOGGEDIN_STATUS,
    value
  };
}

export function updateLogInUrl(propertyPath, value) {
  return {
    type: UPDATE_LOGIN_URL,
    propertyPath,
    value
  };
}

export function logOut() {
  return {
    type: LOG_OUT
  };
}

export function toggleSearchHelpUserMenu(menu, isOpen) {
  return {
    type: UPDATE_SEARCH_HELP_USER_MENU,
    menu,
    isOpen
  };
}
