import { expect } from 'chai';

import * as actions from '../actions';

describe('Profile actions', () => {
  describe('openSideNav', () => {
    it('creates the correct action', () => {
      const action = actions.openSideNav();
      const expectedAction = { type: actions.OPEN_SIDE_NAV };
      expect(action).to.deep.equal(expectedAction);
    });
  });

  describe('closeSideNav', () => {
    describe('when called without an argument', () => {
      it('creates the correct action and sets `focusTriggerButton` to `false`', () => {
        const action = actions.closeSideNav();
        const expectedAction = {
          type: actions.CLOSE_SIDE_NAV,
          focusTriggerButton: false,
        };
        expect(action).to.deep.equal(expectedAction);
      });
    });
    describe('when called with an argument', () => {
      it("passes the argument to the action's `focusTriggerButton` prop", () => {
        const arg = 'blah';
        const action = actions.closeSideNav(arg);
        const expectedAction = {
          type: actions.CLOSE_SIDE_NAV,
          focusTriggerButton: arg,
        };
        expect(action).to.deep.equal(expectedAction);
      });
    });
  });

  describe('pinMenuTrigger', () => {
    it('creates the correct action', () => {
      const action = actions.pinMenuTrigger();
      const expectedAction = { type: actions.PIN_MENU_TRIGGER };
      expect(action).to.deep.equal(expectedAction);
    });
  });

  describe('unpinMenuTrigger', () => {
    it('creates the correct action', () => {
      const action = actions.unpinMenuTrigger();
      const expectedAction = { type: actions.UNPIN_MENU_TRIGGER };
      expect(action).to.deep.equal(expectedAction);
    });
  });
});
