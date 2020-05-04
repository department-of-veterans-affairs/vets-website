import { expect } from 'chai';

import reducer from '../reducers';
import * as actions from '../actions';

describe('Profile reducer', () => {
  let state;
  let reducedState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('OPEN_SIDE_NAV', () => {
    it('sets `isSideNavOpen` to `true` and `focusTriggerButton` to `false`', () => {
      action = {
        type: actions.OPEN_SIDE_NAV,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isSideNavOpen).to.be.true;
      expect(reducedState.focusTriggerButton).to.be.false;
    });
  });

  describe('CLOSE_SIDE_NAV', () => {
    it("sets `isSideNavOpen` to `false` and sets `focusTriggerButton` to the action's value", () => {
      state = {
        isSideNavOpen: true,
      };
      action = {
        type: actions.CLOSE_SIDE_NAV,
        focusTriggerButton: 'blah',
      };
      reducedState = reducer(state, action);
      expect(reducedState.isSideNavOpen).to.be.false;
      expect(reducedState.focusTriggerButton).to.equal('blah');
    });
  });

  describe('PIN_MENU_TRIGGER', () => {
    it('sets `isMenuTriggerPinned` to`true`', () => {
      state = { isMenuTriggerPinned: false };
      action = { type: actions.PIN_MENU_TRIGGER };
      reducedState = reducer(state, action);
      expect(reducedState.isMenuTriggerPinned).to.be.true;
    });
  });

  describe('UNPIN_MENU_TRIGGER', () => {
    it('sets `isMenuTriggerPinned` to`false`', () => {
      state = { isMenuTriggerPinned: true };
      action = { type: actions.UNPIN_MENU_TRIGGER };
      reducedState = reducer(state, action);
      expect(reducedState.isMenuTriggerPinned).to.be.false;
    });
  });
});
