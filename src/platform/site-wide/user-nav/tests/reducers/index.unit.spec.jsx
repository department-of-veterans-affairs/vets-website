import { expect } from 'chai';

import reducer from '../../reducers';
import {
  TOGGLE_FORM_SIGN_IN_MODAL,
  TOGGLE_LOGIN_MODAL,
  UPDATE_SEARCH_HELP_USER_MENU,
  UPDATE_ROUTE,
} from '../../actions';

describe('User Navigation Reducer', () => {
  it('should have a default state', () => {
    const state = reducer(undefined, {});
    expect(state.showLoginModal).to.be.false;
    expect(state.utilitiesMenuIsOpen.search).to.be.false;
    expect(state.utilitiesMenuIsOpen.help).to.be.false;
    expect(state.utilitiesMenuIsOpen.account).to.be.false;
  });

  [true, false].forEach(isOpen => {
    it(`should ${isOpen ? 'show' : 'hide'} the login modal`, () => {
      const state = reducer(undefined, {
        type: TOGGLE_LOGIN_MODAL,
        isOpen,
      });
      expect(state.showLoginModal).to.eql(isOpen);
    });

    it(`should ${isOpen ? 'show' : 'hide'} the form sign-in modal`, () => {
      const state = reducer(undefined, {
        type: TOGGLE_FORM_SIGN_IN_MODAL,
        isOpen,
      });
      expect(state.showFormSignInModal).to.eql(isOpen);
    });

    it(`should ${isOpen ? 'show' : 'hide'} the search menu`, () => {
      const state = reducer(undefined, {
        type: UPDATE_SEARCH_HELP_USER_MENU,
        menu: 'search',
        isOpen,
      });
      expect(state.utilitiesMenuIsOpen.search).to.eql(isOpen);
    });

    it(`should ${isOpen ? 'show' : 'hide'} help menu`, () => {
      const state = reducer(undefined, {
        type: UPDATE_SEARCH_HELP_USER_MENU,
        menu: 'help',
        isOpen,
      });
      expect(state.utilitiesMenuIsOpen.help).to.eql(isOpen);
    });

    it(`should ${isOpen ? 'show' : 'hide'} the account menu`, () => {
      const state = reducer(undefined, {
        type: UPDATE_SEARCH_HELP_USER_MENU,
        menu: 'account',
        isOpen,
      });
      expect(state.utilitiesMenuIsOpen.account).to.eql(isOpen);
    });
  });

  it('should update route', () => {
    const action = {
      location: { base: 'testBase', path: '', search: 'testSearch', hash: '' },
    };
    const state = reducer(undefined, { type: UPDATE_ROUTE, ...action });
    expect(state.route.base).to.eql('testBase');
    expect(state.route.path).to.eql('');
  });
});
