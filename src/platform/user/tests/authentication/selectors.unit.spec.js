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

  describe('ssoeTransactionId', () => {
    it('pulls out state.profile.signin.transactionid', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              transactionid: 'X',
            },
          },
        },
      };

      expect(selectors.ssoeTransactionId(state)).to.eq('X');
    });
    it('returns undefined when the transactionid is not present', () => {
      const state = {
        user: {
          profile: {
            signIn: {},
          },
        },
      };
      expect(selectors.ssoeTransactionId(state)).to.be.undefined;
    });
  });
});
