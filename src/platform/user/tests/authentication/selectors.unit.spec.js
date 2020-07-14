import { expect } from 'chai';
import * as selectors from '../../authentication/selectors';

describe('authentication selectors', () => {
  describe('isAuthenticatedWithSSOe', () => {
    it('pulls out state.profile.signin.ssoe', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              ssoe: true,
            },
          },
        },
      };

      expect(selectors.isAuthenticatedWithSSOe(state)).to.be.true;
    });
    it('returns undefined when the ssoe flag is not present', () => {
      const state = {
        user: {
          profile: {
            signIn: {},
          },
        },
      };
      expect(selectors.isAuthenticatedWithSSOe(state)).to.be.undefined;
    });
  });
});
