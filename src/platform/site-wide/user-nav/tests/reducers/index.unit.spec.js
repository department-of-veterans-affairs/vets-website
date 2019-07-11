import { expect } from 'chai';

import reducer from '../../reducers';
import {
  TOGGLE_FORM_SIGN_IN_MODAL,
  TOGGLE_LOGIN_MODAL,
  UPDATE_SEARCH_HELP_USER_MENU,
} from '../../actions';

describe('User Navigation Reducer', () => {
  it('should have a default state', () => {
    const state = reducer(undefined, {});
    expect(state.showLoginModal).to.be.false;
    expect(state.utilitiesMenuIsOpen.search).to.be.false;
    expect(state.utilitiesMenuIsOpen.help).to.be.false;
    expect(state.utilitiesMenuIsOpen.account).to.be.false;
  });

  it('should hide the login modal', () => {
    const state = reducer(undefined, {
      type: TOGGLE_LOGIN_MODAL,
      isOpen: false,
    });
    expect(state.showLoginModal).to.be.false;
  });

  it('should show the login modal', () => {
    const state = reducer(undefined, {
      type: TOGGLE_LOGIN_MODAL,
      isOpen: true,
    });
    expect(state.showLoginModal).to.be.true;
  });

  it('should hide the form sign-in modal', () => {
    const state = reducer(undefined, {
      type: TOGGLE_FORM_SIGN_IN_MODAL,
      isOpen: false,
    });
    expect(state.showFormSignInModal).to.be.false;
  });

  it('should show the form sign-in modal', () => {
    const state = reducer(undefined, {
      type: TOGGLE_FORM_SIGN_IN_MODAL,
      isOpen: true,
    });
    expect(state.showFormSignInModal).to.be.true;
  });

  it('should close the search menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'search',
      isOpen: false,
    });
    expect(state.utilitiesMenuIsOpen.search).to.be.false;
  });

  it('should open the search menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'search',
      isOpen: true,
    });
    expect(state.utilitiesMenuIsOpen.search).to.be.true;
  });

  it('should close the help menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'help',
      isOpen: false,
    });
    expect(state.utilitiesMenuIsOpen.help).to.be.false;
  });

  it('should open the help menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'help',
      isOpen: true,
    });
    expect(state.utilitiesMenuIsOpen.help).to.be.true;
  });

  it('should close the account menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'account',
      isOpen: false,
    });
    expect(state.utilitiesMenuIsOpen.account).to.be.false;
  });

  it('should open the account menu', () => {
    const state = reducer(undefined, {
      type: UPDATE_SEARCH_HELP_USER_MENU,
      menu: 'account',
      isOpen: true,
    });
    expect(state.utilitiesMenuIsOpen.account).to.be.true;
  });
});
