import { gaClientId } from '../../common/helpers/login-helpers';

export const LOG_OUT = 'LOG_OUT';
export const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL';
export const UPDATE_LOGGEDIN_STATUS = 'UPDATE_LOGGEDIN_STATUS';
export const UPDATE_LOGIN_URLS = 'UPDATE_LOGIN_URLS';
export const UPDATE_LOGOUT_URL = 'UPDATE_LOGOUT_URL';
export const UPDATE_MULTIFACTOR_URL = 'UPDATE_MULTIFACTOR_URL';
export const UPDATE_SEARCH_HELP_USER_MENU = 'UPDATE_SEARCH_HELP_USER_MENU';
export const UPDATE_VERIFY_URL = 'UPDATE_VERIFY_URL';

export function updateLoggedInStatus(value) {
  return {
    type: UPDATE_LOGGEDIN_STATUS,
    value
  };
}

export function updateLogInUrls(value) {
  return {
    type: UPDATE_LOGIN_URLS,
    value,
    gaClientId: gaClientId()
  };
}

export function updateMultifactorUrl(value) {
  return {
    type: UPDATE_MULTIFACTOR_URL,
    value,
    gaClientId: gaClientId()
  };
}

export function updateVerifyUrl(value) {
  return {
    type: UPDATE_VERIFY_URL,
    value,
    gaClientId: gaClientId()
  };
}

export function updateLogoutUrl(value) {
  return {
    type: UPDATE_LOGOUT_URL,
    value,
    gaClientId: gaClientId()
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

export function toggleLoginModal(isOpen) {
  return {
    type: TOGGLE_LOGIN_MODAL,
    isOpen,
  };
}
