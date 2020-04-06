import {
  TOGGLE_LOGIN_MODAL,
  UPDATE_SEARCH_HELP_USER_MENU,
  toggleLoginModal,
  toggleSearchHelpUserMenu,
} from '../../actions';

describe('User Nav Actions', () => {
  test('should hide the login modal', () => {
    expect(toggleLoginModal(false)).toEqual({
      type: TOGGLE_LOGIN_MODAL,
      isOpen: false,
    });
  });

  test('should show the login modal', () => {
    expect(toggleLoginModal(true)).toEqual({
      type: TOGGLE_LOGIN_MODAL,
      isOpen: true,
    });
  });

  test('should close a specified dropdown menu', () => {
    expect(toggleSearchHelpUserMenu('search', false)).toEqual({
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'search',
      isOpen: false,
    });
  });

  test('should open a specified dropdown menu', () => {
    expect(toggleSearchHelpUserMenu('help', true)).toEqual({
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'help',
      isOpen: true,
    });
  });
});
