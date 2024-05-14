import { UPDATE_EXPANDED_MENU_ID, UPDATE_SUB_MENU } from './constants';

export const initialState = {
  expandedMenuID: undefined,
  lastClickedMenuID: undefined,
  subMenu: undefined,
};

export default (state = initialState, action = {}) => {
  if (action.type === UPDATE_EXPANDED_MENU_ID) {
    return {
      ...state,
      expandedMenuID: action.expandedMenuID,
      lastClickedMenuID: undefined,
    };
  }

  if (action.type === UPDATE_SUB_MENU) {
    return {
      ...state,
      lastClickedMenuID: action.subMenu?.id || state.lastClickedMenuID,
      subMenu: action.subMenu,
    };
  }

  return state;
};
