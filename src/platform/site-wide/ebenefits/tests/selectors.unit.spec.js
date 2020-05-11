import { expect } from 'chai';
import * as selectors from '../selectors';

describe('ebenefits selectors', () => {
  describe('shouldUseProxyUrl', () => {
    let state = {};
    beforeEach(() => {
      state = {
        featureToggles: {
          ssoe: false,
          ssoeEbenefitsLinks: false,
        },
        user: {
          login: {
            currentlyLoggedIn: false,
          },
        },
      };
    });

    it('renders false when user is logged out', () => {
      state.featureToggles.ssoe = true;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
      state.featureToggles.ssoeEbenefitsLinks = true;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
    });
    it('renders false when feature flags are off', () => {
      state.user.login.currentlyLoggedIn = true;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
      state.featureToggles.ssoe = true;
      state.featureToggles.ssoeEbenefitsLinks = false;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
      state.featureToggles.ssoe = false;
      state.featureToggles.ssoeEbenefitsLinks = true;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
    });
    it('renders true when user is logged in and feature flags are on', () => {
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
      state.user.login.currentlyLoggedIn = true;
      state.featureToggles.ssoe = true;
      state.featureToggles.ssoeEbenefitsLinks = true;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(true);
    });
  });
});
