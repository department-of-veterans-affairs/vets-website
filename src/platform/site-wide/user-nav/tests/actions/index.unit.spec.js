import { expect } from 'chai';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import {
  UPDATE_SEARCH_HELP_USER_MENU,
  UPDATE_ROUTE,
  TOGGLE_FORM_SIGN_IN_MODAL,
  toggleLoginModal,
  toggleSearchHelpUserMenu,
  toggleFormSignInModal,
  updateRoute,
} from '../../actions';
import reducers from '../../reducers';

describe('User Nav Actions', () => {
  describe('toggleLoginModal', () => {
    let store;
    const oldLocation = global.window.location;

    beforeEach(() => {
      store = createStore(reducers, applyMiddleware(thunk));
    });

    afterEach(() => {
      global.window.location = oldLocation;
    });

    [true, false].forEach(bool => {
      it(`should dispatch an action to ${
        bool ? 'open' : 'close'
      }`, async () => {
        const options = { isOpen: bool, trigger: 'header' };

        await toggleLoginModal(options.isOpen, options.trigger)(
          store.dispatch,
          () => ({
            featureToggles: {
              signInServiceEnabled: false,
            },
          }),
        );

        const state = store.getState();
        expect(state.showLoginModal).to.eql(bool);
        expect(state.modalInformation).to.eql({
          startingLocation: window.location.pathname,
          redirectLocation: window.location.pathname,
          trigger: options.trigger,
        });
      });
    });

    it('should append `?next=loginModal` query parameter when opened', async () => {
      expect(global.window.location.href.includes('localhost')).to.be.true;
      await toggleLoginModal(true)(store.dispatch, () => ({
        featureToggles: {
          signInServiceEnabled: false,
        },
      }));

      expect(global.window.location.href.includes('?next=loginModal')).to.be
        .true;
    });

    it('should append `oauth=true` query parameter when opened and `signInServiceEnabled` flag is true', async () => {
      expect(global.window.location.href.includes('localhost')).to.be.true;
      await toggleLoginModal(true)(store.dispatch, () => ({
        featureToggles: {
          signInServiceEnabled: true,
        },
      }));

      expect(
        global.window.location.href.includes('?next=loginModal&oauth=true'),
      ).to.be.true;
    });

    it('should append the correct `next` query if it exists', async () => {
      const expectedNextParam = '?next=disabilityBenefits';
      global.window.location = new URL(`http://localhost/${expectedNextParam}`);

      await toggleLoginModal(true)(store.dispatch, () => ({
        featureToggles: {
          signInServiceEnabled: false,
        },
      }));

      expect(global.window.location.href.includes('?next=disabilityBenefits'))
        .to.be.true;
    });

    it('should remove all query parameters when closing the modal', async () => {
      global.window.location.search = '?next=loginModal&oauth=false';

      await toggleLoginModal(false)(store.dispatch, () => ({
        featureToggles: {
          signInServiceEnabled: false,
        },
      }));

      expect(global.window.location.href).to.eql('http://localhost/');
    });
  });

  describe('toggleSearchHelpUserMenu', () => {
    it('should close a specified dropdown menu', () => {
      expect(toggleSearchHelpUserMenu('search', false)).to.deep.equal({
        type: UPDATE_SEARCH_HELP_USER_MENU,
        menu: 'search',
        isOpen: false,
      });
    });

    it('should open a specified dropdown menu', () => {
      expect(toggleSearchHelpUserMenu('help', true)).to.deep.equal({
        type: UPDATE_SEARCH_HELP_USER_MENU,
        menu: 'help',
        isOpen: true,
      });
    });
  });

  describe('toggleFormSignInModal', () => {
    [true, false].forEach(isOpen => {
      it(`should toggle the form sign-in modal ${
        isOpen ? 'open' : 'close'
      }`, () => {
        expect(toggleFormSignInModal(isOpen)).to.eql({
          type: TOGGLE_FORM_SIGN_IN_MODAL,
          isOpen,
        });
      });
    });
  });

  describe('updateRoute', () => {
    it('should return an empty `location` object when called with null or undefined', () => {
      expect(updateRoute()).to.eql({ type: UPDATE_ROUTE, location: {} });
      expect(updateRoute(null)).to.eql({ type: UPDATE_ROUTE, location: {} });
    });

    it('should return the location object', () => {
      const testLocation = {
        base: 'testBase',
        pathname: 'testPathname',
        search: {},
        hash: 'testHash',
      };
      expect(updateRoute(testLocation)).to.eql({
        type: UPDATE_ROUTE,
        location: {
          base: testLocation.base,
          path: testLocation.pathname,
          search: testLocation.search,
          hash: testLocation.hash,
        },
      });
    });
  });
});
