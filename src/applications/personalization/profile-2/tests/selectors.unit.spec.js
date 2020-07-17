import { expect } from 'chai';

import * as selectors from '../selectors';

describe('Profile selectors', () => {
  const state = {
    profileUi: {
      isSideNavOpen: false,
      isMenuTriggerPinned: false,
      focusTriggerButton: false,
    },
  };

  describe('selectIsSideNavOpen', () => {
    it('selects the correct piece of state if it exists', () => {
      expect(selectors.selectIsSideNavOpen(state)).to.be.false;
    });
    it('returns undefined if it does not exists', () => {
      expect(selectors.selectIsSideNavOpen({})).to.be.undefined;
    });
  });

  describe('selectIsMenuTriggerPinned', () => {
    it('selects the correct piece of state if it exists', () => {
      expect(selectors.selectIsMenuTriggerPinned(state)).to.be.false;
    });
    it('returns undefined if it does not exists', () => {
      expect(selectors.selectIsMenuTriggerPinned({})).to.be.undefined;
    });
  });

  describe('selectFocusTriggerButton', () => {
    it('selects the correct piece of state if it exists', () => {
      expect(selectors.selectFocusTriggerButton(state)).to.be.false;
    });
    it('returns undefined if it does not exists', () => {
      expect(selectors.selectFocusTriggerButton({})).to.be.undefined;
    });
  });
});
