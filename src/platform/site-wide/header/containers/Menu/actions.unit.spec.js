// Node modules.
import { expect } from 'chai';
// Relative imports.
import { updateExpandedMenuIDAction, updateSubMenuAction } from './actions';
import { UPDATE_EXPANDED_MENU_ID, UPDATE_SUB_MENU } from './constants';

describe('Menu actions', () => {
  it('updateExpandedMenuIDAction', () => {
    // Set up.
    const expandedMenuID = '123';
    const action = updateExpandedMenuIDAction(expandedMenuID);

    // Assertions.
    expect(action).to.deep.equal({
      expandedMenuID,
      type: UPDATE_EXPANDED_MENU_ID,
    });
  });

  it('updateExpandedMenuIDAction', () => {
    // Set up.
    const subMenu = { id: '123' };
    const action = updateSubMenuAction(subMenu);

    // Assertions.
    expect(action).to.deep.equal({
      subMenu,
      type: UPDATE_SUB_MENU,
    });
  });
});
