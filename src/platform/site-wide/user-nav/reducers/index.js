import set from '../../../utilities/data/set';

import {
  TOGGLE_FORM_SIGN_IN_MODAL,
  TOGGLE_LOGIN_MODAL,
  UPDATE_SEARCH_HELP_USER_MENU,
  TOGGLE_ACCOUNT_TRANSITION_MODAL,
  TOGGLE_ACCOUNT_TRANSITION_SUCCESS_MODAL,
  UPDATE_ROUTE,
} from '../actions';

const initialState = {
  route: {},
  showFormSignInModal: false,
  showLoginModal: false,
  showAccountTransitionModal: false,
  showAccountTransitionSuccessModal: false,
  utilitiesMenuIsOpen: {
    search: false,
    help: false,
    account: false,
  },
};

function closeAllMenus(menuState) {
  const menus = menuState.utilitiesMenuIsOpen;

  Object.keys(menus).forEach(menu => {
    menus[menu] = false;
  });
}

export default function userNavReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_FORM_SIGN_IN_MODAL:
      return set('showFormSignInModal', action.isOpen, state);

    case TOGGLE_LOGIN_MODAL:
      return set('showLoginModal', action.isOpen, state);

    case UPDATE_SEARCH_HELP_USER_MENU:
      closeAllMenus(state);
      return set(`utilitiesMenuIsOpen.${action.menu}`, action.isOpen, state);

    case TOGGLE_ACCOUNT_TRANSITION_MODAL:
      return set('showAccountTransitionModal', action.isOpen, state);

    case TOGGLE_ACCOUNT_TRANSITION_SUCCESS_MODAL:
      return set('showAccountTransitionSuccessModal', action.isOpen, state);

    case UPDATE_ROUTE:
      return set(
        'route',
        {
          base: action.location?.base,
          path: action.location?.path,
          search: action.location?.search,
          hash: action.location?.hash,
        },
        state,
      );

    default:
      return state;
  }
}
