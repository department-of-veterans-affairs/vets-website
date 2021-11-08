// Node modules.
import { expect } from 'chai';
// Relative imports.
import headerMenuReducer, { initialState } from './reducer';
import { UPDATE_EXPANDED_MENU_ID, UPDATE_SUB_MENU } from './constants';

describe('Menu reducer', () => {
  it('initialState is what we expect', () => {
    // Assertions.
    expect(initialState).to.deep.equal({
      expandedMenuID: undefined,
      subMenu: undefined,
    });
  });

  it('headerMenuReducer default case', () => {
    // Assertions.
    expect(headerMenuReducer()).to.deep.equal(initialState);
  });

  it('headerMenuReducer handles UPDATE_EXPANDED_MENU_ID case', () => {
    // Set up.
    const action = { expandedMenuID: 'test', type: UPDATE_EXPANDED_MENU_ID };

    // Assertions.
    expect(headerMenuReducer(initialState, action)).to.deep.equal({
      expandedMenuID: 'test',
      subMenu: undefined,
    });
  });

  it('headerMenuReducer handles UPDATE_SUB_MENU case', () => {
    // Set up.
    const action = { subMenu: 'test', type: UPDATE_SUB_MENU };

    // Assertions.
    expect(headerMenuReducer(initialState, action)).to.deep.equal({
      expandedMenuID: undefined,
      subMenu: 'test',
    });
  });
});
