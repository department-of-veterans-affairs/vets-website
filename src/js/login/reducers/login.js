import _ from 'lodash/fp';

import {
  LOG_OUT,
  TOGGLE_LOGIN_MODAL,
  UPDATE_LOGGEDIN_STATUS,
  UPDATE_SEARCH_HELP_USER_MENU,
} from '../actions';

const initialState = {
  currentlyLoggedIn: false,
  showModal: false,
  utilitiesMenuIsOpen: {
    search: false,
    help: false,
    account: false
  }
};

function closeAllMenus(menuState) {
  const menus = menuState.utilitiesMenuIsOpen;

  Object.keys(menus).forEach(menu => {
    menus[menu] = false;
  });
}

function loginStuff(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOGGEDIN_STATUS:
      return _.set('currentlyLoggedIn', action.value, state);

    case TOGGLE_LOGIN_MODAL:
      return _.set('showModal', action.isOpen, state);

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
