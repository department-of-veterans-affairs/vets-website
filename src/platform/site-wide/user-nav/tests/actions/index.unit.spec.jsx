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
    const featureToggleNotEnabled = {
      featureToggles: { cernerNonEligibleSisEnabled: false },
    };

    beforeEach(() => {
      store = createStore(reducers, applyMiddleware(thunk));
    });

    afterEach(() => {
      global.window.location = oldLocation;
    });

    [true, false].forEach(isOpen => {
      it(`should dispatch an action to ${
        isOpen ? 'open' : 'close'
      } the loginModal`, async () => {
        const options = { isOpen, trigger: 'header' };

        await toggleLoginModal(options.isOpen, options.trigger)(
          store.dispatch,
          () => ({ ...featureToggleNotEnabled }),
        );

        const state = store.getState();
        expect(state.showLoginModal).to.eql(isOpen);
        expect(state.modalInformation).to.eql({
          trigger: options.trigger,
        });
      });
    });

    it('should append `verification=required` when dispatched as such', async () => {
      expect(global.window.location.href.includes('localhost')).to.be.true;
      await toggleLoginModal(true, '', true)(store.dispatch, () => ({
        ...featureToggleNotEnabled,
      }));

      expect(global.window.location.href.includes('verification=required')).to
        .be.true;
    });

    it('should append `?next=loginModal` query parameter when opened', async () => {
      expect(global.window.location.href.includes('localhost')).to.be.true;
      await toggleLoginModal(true)(store.dispatch, () => ({
        ...featureToggleNotEnabled,
      }));

      expect(global.window.location.href.includes('?next=loginModal')).to.be
        .true;
    });

    it('should append the correct `next` query if it exists', async () => {
      const expectedNextParam = '?next=disabilityBenefits';
      global.window.location = new URL(`http://localhost/${expectedNextParam}`);

      await toggleLoginModal(true)(store.dispatch, () => ({
        ...featureToggleNotEnabled,
      }));

      expect(global.window.location.href.includes('?next=disabilityBenefits'))
        .to.be.true;
    });

    it('should remove all query parameters when closing the modal', async () => {
      global.window.location.search = '?next=loginModal&oauth=false';

      await toggleLoginModal(false)(store.dispatch, () => ({
        ...featureToggleNotEnabled,
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
