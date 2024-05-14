import { UPDATE_EXPANDED_MENU_ID, UPDATE_SUB_MENU } from './constants';

export const updateExpandedMenuIDAction = expandedMenuID => ({
  expandedMenuID,
  type: UPDATE_EXPANDED_MENU_ID,
});

export const updateSubMenuAction = subMenu => ({
  subMenu,
  type: UPDATE_SUB_MENU,
});
