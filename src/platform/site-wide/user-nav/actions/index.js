import appendQuery from 'append-query';

export const TOGGLE_FORM_SIGN_IN_MODAL = 'TOGGLE_FORM_SIGN_IN_MODAL';
export const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL';
export const UPDATE_SEARCH_HELP_USER_MENU = 'UPDATE_SEARCH_HELP_USER_MENU';
export const UPDATE_ROUTE = 'UPDATE_ROUTE';

export function toggleFormSignInModal(isOpen) {
  return { type: TOGGLE_FORM_SIGN_IN_MODAL, isOpen };
}

export function toggleLoginModal(isOpen, trigger = 'header', derivedUrl) {
  return async (dispatch, getState) => {
    const { signInServiceEnabled } = getState()?.featureToggles;

    const nextQuery = {
      next:
        new URLSearchParams(window.location.search).get('next') ?? 'loginModal',
      ...(signInServiceEnabled && { oauth: true }),
    };

    const url = isOpen
      ? appendQuery(window.location.toString(), nextQuery)
      : `${window.location.origin}${window.location.pathname}`;
    window.history.pushState({}, '', url);

    await dispatch({
      type: TOGGLE_LOGIN_MODAL,
      isOpen,
      trigger,
      startingLocation: window.location.pathname,
      redirectLocation: derivedUrl ?? window.location.pathname,
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
