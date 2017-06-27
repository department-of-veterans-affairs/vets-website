import _ from 'lodash/fp';

import {
  UPDATE_LOGGEDIN_STATUS,
  UPDATE_LOGIN_URL,
  UPDATE_VERIFY_URL,
  UPDATE_LOGOUT_URL,
  UPDATE_SEARCH_HELP_USER_MENU,
  LOG_OUT
} from '../actions';

const initialState = {
  currentlyLoggedIn: false,
  loginUrl: null,
  verifyUrl: null,
  logoutUrl: null,
  utilitiesMenuIsOpen: {
    search: false,
    help: false,
    account: false
  }
};

function closeAllMenus(menuState) {
  const menus = menuState.utilitiesMenuIsOpen;
  let menu;

  for (menu in menus) {
    if (menus.hasOwnProperty(menu)) {
      menus[menu] = false;
    }
  }
}

function loginStuff(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOGGEDIN_STATUS:
      return _.set('currentlyLoggedIn', action.value, state);

    case UPDATE_LOGIN_URL:
      return _.set('loginUrl', action.value, state);

    case UPDATE_VERIFY_URL:
      return _.set('verifyUrl', action.value, state);

    case UPDATE_LOGOUT_URL:
      return _.set('logoutUrl', action.value, state);

    case LOG_OUT:
      return _.set('currentlyLoggedIn', false, state);

    case UPDATE_SEARCH_HELP_USER_MENU:
      closeAllMenus(state);
      return _.set(`utilitiesMenuIsOpen.${action.menu}`, action.isOpen, state);

    default:
      return state;
  }
}

export default loginStuff;
