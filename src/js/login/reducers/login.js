import _ from 'lodash/fp';

import { UPDATE_LOGGEDIN_STATUS, UPDATE_LOGIN_URL, UPDATE_SEARCH_HELP_USER_MENU } from '../actions';
import { LOG_OUT } from '../../common/actions';

const initialState = {
  currentlyLoggedIn: true,
  loginUrl: {
    first: null,
    third: null
  },
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
      // Updates either the login URL (loginUrl.first) or the verify URL to uplevel
      // from LOA1 to LOA3 (loginUrl.third)
      return _.set(`loginUrl.${action.propertyPath}`, action.value, state);

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
