import recordEvent from 'platform/monitoring/record-event';

export const TOGGLE_FORM_SIGN_IN_MODAL = 'TOGGLE_FORM_SIGN_IN_MODAL';
export const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL';
export const UPDATE_SEARCH_HELP_USER_MENU = 'UPDATE_SEARCH_HELP_USER_MENU';
export const LOG_SEARCH_TYPEAHEAD_ENABLED = 'LOG_SEARCH_TYPEAHEAD_ENABLED';

export function toggleFormSignInModal(isOpen) {
  return { type: TOGGLE_FORM_SIGN_IN_MODAL, isOpen };
}

export function toggleLoginModal(isOpen, context) {
  if (isOpen) {
    const event = context
      ? `login-link-clicked-${context}`
      : `login-link-clicked-cta`;

    recordEvent({ event });
  }

  return { type: TOGGLE_LOGIN_MODAL, isOpen };
}

export function toggleSearchHelpUserMenu(menu, isOpen) {
  return {
    type: UPDATE_SEARCH_HELP_USER_MENU,
    menu,
    isOpen,
  };
}

export function logSearchTypeaheadEnabledAction() {
  return {
    type: LOG_SEARCH_TYPEAHEAD_ENABLED,
  };
}
