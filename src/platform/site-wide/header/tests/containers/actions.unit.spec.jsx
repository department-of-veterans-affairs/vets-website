import { expect } from 'chai';
import {
  updateExpandedMenuIDAction,
  updateSubMenuAction,
} from '../../containers/Menu/actions';
import {
  UPDATE_EXPANDED_MENU_ID,
  UPDATE_SUB_MENU,
} from '../../containers/Menu/constants';

describe('Menu actions', () => {
  it('updateExpandedMenuIDAction', () => {
    const expandedMenuID = '123';
    const action = updateExpandedMenuIDAction(expandedMenuID);

    expect(action).to.deep.equal({
      expandedMenuID,
      type: UPDATE_EXPANDED_MENU_ID,
    });
  });

  it('updateExpandedMenuIDAction', () => {
    const subMenu = { id: '123' };
    const action = updateSubMenuAction(subMenu);

    expect(action).to.deep.equal({
      subMenu,
      type: UPDATE_SUB_MENU,
    });
  });
});
