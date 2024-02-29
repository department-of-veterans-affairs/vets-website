export const TOGGLE_FORM_SIGN_IN_MODAL = 'TOGGLE_FORM_SIGN_IN_MODAL';
export const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL';
export const UPDATE_SEARCH_HELP_USER_MENU = 'UPDATE_SEARCH_HELP_USER_MENU';
export const TOGGLE_ACCOUNT_TRANSITION_MODAL =
  'TOGGLE_ACCOUNT_TRANSITION_MODAL';
export const TOGGLE_ACCOUNT_TRANSITION_SUCCESS_MODAL =
  'TOGGLE_ACCOUNT_TRANSITION_SUCCESS_MODAL';

export function toggleFormSignInModal(isOpen) {
  return { type: TOGGLE_FORM_SIGN_IN_MODAL, isOpen };
}

export function toggleAccountTransitionModal(isOpen) {
  return { type: TOGGLE_ACCOUNT_TRANSITION_MODAL, isOpen };
}

export function toggleAccountTransitionSuccessModal(isOpen) {
  return { type: TOGGLE_ACCOUNT_TRANSITION_SUCCESS_MODAL, isOpen };
}

export function toggleLoginModal(isOpen) {
  return { type: TOGGLE_LOGIN_MODAL, isOpen };
}

export function toggleSearchHelpUserMenu(menu, isOpen) {
  return {
    type: UPDATE_SEARCH_HELP_USER_MENU,
    menu,
    isOpen,
  };
}
