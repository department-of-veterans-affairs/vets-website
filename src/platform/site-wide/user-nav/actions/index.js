import recordEvent from '../../../monitoring/record-event';

export const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL';
export const UPDATE_SEARCH_HELP_USER_MENU = 'UPDATE_SEARCH_HELP_USER_MENU';

export function toggleSearchHelpUserMenu(menu, isOpen) {
  return {
    type: UPDATE_SEARCH_HELP_USER_MENU,
    menu,
    isOpen,
  };
}

export function toggleLoginModal(isOpen, context) {
  if (isOpen) {
    const event = context
      ? `login-link-clicked-${context}`
      : `login-link-clicked-forms`;

    recordEvent({ event });
  }

  return {
    type: TOGGLE_LOGIN_MODAL,
    isOpen,
  };
}
