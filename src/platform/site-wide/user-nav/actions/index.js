import appendQuery from 'append-query';

export const TOGGLE_FORM_SIGN_IN_MODAL = 'TOGGLE_FORM_SIGN_IN_MODAL';
export const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL';
export const UPDATE_SEARCH_HELP_USER_MENU = 'UPDATE_SEARCH_HELP_USER_MENU';
export const UPDATE_ROUTE = 'UPDATE_ROUTE';

export function toggleFormSignInModal(isOpen) {
  return { type: TOGGLE_FORM_SIGN_IN_MODAL, isOpen };
}

export function toggleLoginModal(
  isOpen,
  trigger = 'header',
  forceVerification = false,
) {
  return async (dispatch, getState) => {
    const { signInServiceEnabled } = getState()?.featureToggles;

    const nextParam = new URLSearchParams(window?.location?.search)?.get(
      'next',
    );
    const nextQuery = {
      next: nextParam ?? 'loginModal',
      ...(signInServiceEnabled && { oauth: true }),
      ...(forceVerification && { verification: 'required' }),
    };

    const url = isOpen
      ? appendQuery(window.location.toString(), nextQuery)
      : `${window.location.origin}${window.location.pathname}`;
    window.history.pushState({}, '', url);

    return dispatch({
      type: TOGGLE_LOGIN_MODAL,
      isOpen,
      trigger,
    });
  };
}

export function toggleSearchHelpUserMenu(menu, isOpen) {
  return {
    type: UPDATE_SEARCH_HELP_USER_MENU,
    menu,
    isOpen,
  };
}

export function updateRoute(location) {
  if (!location) {
    return {
      type: UPDATE_ROUTE,
      location: {},
    };
  }

  return {
    type: UPDATE_ROUTE,
    location: {
      base: location.base,
      path: location.pathname,
      search: location.search,
      hash: location.hash,
    },
  };
}
