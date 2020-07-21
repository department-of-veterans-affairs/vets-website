import { expect } from 'chai';
import * as selectors from '../selectors';

describe('ebenefits selectors', () => {
  describe('shouldUseProxyUrl', () => {
    let state = {};
    beforeEach(() => {
      state = {
        featureToggles: {
          ssoeEbenefitsLinks: false,
        },
        user: {
          profile: {
            signIn: {},
          },
        },
      };
    });

    it('renders false when user is logged out', () => {
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
      state.featureToggles.ssoeEbenefitsLinks = true;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
    });
    it('renders false when feature flags are off', () => {
      state.user.profile.signIn.ssoe = true;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
      state.featureToggles.ssoeEbenefitsLinks = false;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
    });
    it('renders true when user is logged in and feature flags are on', () => {
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
      state.user.profile.signIn.ssoe = true;
      state.featureToggles.ssoeEbenefitsLinks = true;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(true);
    });
  });
});
