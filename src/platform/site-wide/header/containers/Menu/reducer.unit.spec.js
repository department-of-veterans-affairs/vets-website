import { expect } from 'chai';
import headerMenuReducer, { initialState } from './reducer';
import { UPDATE_EXPANDED_MENU_ID, UPDATE_SUB_MENU } from './constants';

describe('Menu reducer', () => {
  it('initialState is what we expect', () => {
    expect(initialState).to.deep.equal({
      expandedMenuID: undefined,
      lastClickedMenuID: undefined,
      subMenu: undefined,
    });
  });

  it('headerMenuReducer default case', () => {
    expect(headerMenuReducer()).to.deep.equal(initialState);
  });

  it('headerMenuReducer handles UPDATE_EXPANDED_MENU_ID case', () => {
    const action = { expandedMenuID: 'test', type: UPDATE_EXPANDED_MENU_ID };

    expect(headerMenuReducer(initialState, action)).to.deep.equal({
      expandedMenuID: 'test',
      lastClickedMenuID: undefined,
      subMenu: undefined,
    });
  });

  it('headerMenuReducer handles UPDATE_SUB_MENU case', () => {
    const action = { subMenu: { id: 'test' }, type: UPDATE_SUB_MENU };

    expect(headerMenuReducer(initialState, action)).to.deep.equal({
      expandedMenuID: undefined,
      lastClickedMenuID: 'test',
      subMenu: { id: 'test' },
    });
  });
});
