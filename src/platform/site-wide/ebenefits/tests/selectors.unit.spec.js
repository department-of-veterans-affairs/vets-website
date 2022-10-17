import { expect } from 'chai';
import * as selectors from '../selectors';

describe('ebenefits selectors', () => {
  describe('shouldUseProxyUrl', () => {
    let state = {};
    beforeEach(() => {
      state = {
        user: {
          profile: {
            session: {
              ssoe: false,
            },
          },
        },
      };
    });

    it('renders false when user is logged out', () => {
      expect(selectors.shouldUseProxyUrl(state)).to.equal(false);
    });
    it('renders true when user is logged in and feature flags are on', () => {
      state.user.profile.session.ssoe = true;
      expect(selectors.shouldUseProxyUrl(state)).to.equal(true);
    });
  });
});
