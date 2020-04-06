import reducer from '../../reducers';
import {
  TOGGLE_FORM_SIGN_IN_MODAL,
  TOGGLE_LOGIN_MODAL,
  UPDATE_SEARCH_HELP_USER_MENU,
} from '../../actions';

describe('User Navigation Reducer', () => {
  it('should have a default state', () => {
    const state = reducer(undefined, {});
    expect(state.showLoginModal).toBe(false);
    expect(state.utilitiesMenuIsOpen.search).toBe(false);
    expect(state.utilitiesMenuIsOpen.help).toBe(false);
    expect(state.utilitiesMenuIsOpen.account).toBe(false);
  });

  it('should hide the login modal', () => {
    const state = reducer(undefined, {
      type: TOGGLE_LOGIN_MODAL,
      isOpen: false,
    });
    expect(state.showLoginModal).toBe(false);
  });

  it('should show the login modal', () => {
    const state = reducer(undefined, {
      type: TOGGLE_LOGIN_MODAL,
      isOpen: true,
    });
    expect(state.showLoginModal).toBe(true);
  });

  it('should hide the form sign-in modal', () => {
    const state = reducer(undefined, {
      type: TOGGLE_FORM_SIGN_IN_MODAL,
      isOpen: false,
    });
    expect(state.showFormSignInModal).toBe(false);
  });

  it('should show the form sign-in modal', () => {
    const state = reducer(undefined, {
      type: TOGGLE_FORM_SIGN_IN_MODAL,
      isOpen: true,
    });
    expect(state.showFormSignInModal).toBe(true);
  });

  it('should close the search menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'search',
      isOpen: false,
    });
    expect(state.utilitiesMenuIsOpen.search).toBe(false);
  });

  it('should open the search menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'search',
      isOpen: true,
    });
    expect(state.utilitiesMenuIsOpen.search).toBe(true);
  });

  it('should close the help menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'help',
      isOpen: false,
    });
    expect(state.utilitiesMenuIsOpen.help).toBe(false);
  });

  it('should open the help menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'help',
      isOpen: true,
    });
    expect(state.utilitiesMenuIsOpen.help).toBe(true);
  });

  it('should close the account menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'account',
      isOpen: false,
    });
    expect(state.utilitiesMenuIsOpen.account).toBe(false);
  });

  it('should open the account menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'account',
      isOpen: true,
    });
    expect(state.utilitiesMenuIsOpen.account).toBe(true);
  });
});
