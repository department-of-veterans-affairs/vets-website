import {
  TOGGLE_LOGIN_MODAL,
  UPDATE_SEARCH_HELP_USER_MENU,
  toggleLoginModal,
  toggleSearchHelpUserMenu,
} from '../../actions';

describe('User Nav Actions', () => {
  it('should hide the login modal', () => {
    expect(toggleLoginModal(false)).toEqual({
      type: TOGGLE_LOGIN_MODAL,
      isOpen: false,
    });
  });

  it('should show the login modal', () => {
    expect(toggleLoginModal(true)).toEqual({
      type: TOGGLE_LOGIN_MODAL,
      isOpen: true,
    });
  });

  it('should close a specified dropdown menu', () => {
    expect(toggleSearchHelpUserMenu('search', false)).toEqual({
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'search',
      isOpen: false,
    });
  });

  it('should open a specified dropdown menu', () => {
    expect(toggleSearchHelpUserMenu('help', true)).toEqual({
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'help',
      isOpen: true,
    });
  });
});
