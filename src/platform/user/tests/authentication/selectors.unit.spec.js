import { expect } from 'chai';
import * as selectors from '../../authentication/selectors';

describe('authentication selectors', () => {
  describe('isAuthenticatedWithSSOe', () => {
    it('pulls out state.session.ssoe', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              ssoe: false,
            },
            session: {
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
            session: {},
          },
        },
      };
      expect(selectors.isAuthenticatedWithSSOe(state)).to.be.undefined;
    });
  });

  describe('ssoeTransactionId', () => {
    it('pulls out state.session.transactionid', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              transactionid: 'X',
            },
            session: {
              transactionid: 'Y',
            },
          },
        },
      };

      expect(selectors.ssoeTransactionId(state)).to.eq('Y');
    });
    it('returns undefined when the transactionid is not present', () => {
      const state = {
        user: {
          session: {
            profile: {
              ssoe: false,
            },
          },
        },
      };
      expect(selectors.ssoeTransactionId(state)).to.be.undefined;
    });
  });
});
