export const UPDATE_LOGGEDIN_STATUS = 'UPDATE_LOGGEDIN_STATUS';
export const UPDATE_LOGIN_URL = 'UPDATE_LOGIN_URL';
export const UPDATE_SEARCH_HELP_USER_MENU = 'UPDATE_SEARCH_HELP_USER_MENU';

export function updateLoggedInStatus(value) {
  return {
    type: UPDATE_LOGGEDIN_STATUS,
    value
  };
}

// Action creator for updating either the login URL (propertyPath == 'first')
// or the verify URL for up-leveling from LOA1 to LOA3 (propertyPath == 'third')
export function updateLogInUrl(propertyPath, value) {
  return {
    type: UPDATE_LOGIN_URL,
    propertyPath,
    value
  };
}

export function toggleSearchHelpUserMenu(menu, isOpen) {
  return {
    type: UPDATE_SEARCH_HELP_USER_MENU,
    menu,
    isOpen
  };
}
