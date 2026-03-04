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

  describe('hasCheckedKeepAlive', () => {
    it('pulls out state.user.login.hasCheckedKeepAlive', () => {
      const state = {
        user: {
          login: {
            hasCheckedKeepAlive: true,
          },
        },
      };

      expect(selectors.hasCheckedKeepAlive(state)).to.be.true;
    });
    it('returns undefined when the hasCheckedKeepAlive flag is not present', () => {
      const state = {
        user: {
          login: {},
        },
      };

      expect(selectors.hasCheckedKeepAlive(state)).to.be.undefined;
    });
  });

  describe('signInServiceName', () => {
    it('pulls out state.profile.signIn.serviceName', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              serviceName: 'test',
            },
          },
        },
      };

      expect(selectors.signInServiceName(state)).to.eq('test');
    });
    it('returns undefined when the serviceName is not present', () => {
      const state = {
        user: {
          profile: {
            signIn: {},
          },
        },
      };

      expect(selectors.signInServiceName(state)).to.be.undefined;
    });
  });

  describe('isAuthenticatedWithOAuth', () => {
    const clearInfoTokenCookie = () => {
      document.cookie =
        'vagov_info_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    };

    afterEach(() => {
      clearInfoTokenCookie();
    });
    it('returns true when the authBroker is sis', () => {
      const state = {
        user: {
          profile: {
            session: {
              authBroker: 'sis',
            },
          },
        },
      };

      expect(selectors.isAuthenticatedWithOAuth(state)).to.be.true;
    });
    it('returns true when the infoToken exists', () => {
      document.cookie = 'vagov_info_token=true';
      const state = {
        user: {
          profile: {
            session: {
              authBroker: 'not sis',
            },
          },
        },
      };

      expect(selectors.isAuthenticatedWithOAuth(state)).to.be.true;
    });
    it('returns false when the authBroker is not sis and the infoToken does not exist', () => {
      const state = {
        user: {
          profile: {
            session: {
              authBroker: 'not sis',
            },
          },
        },
      };

      expect(selectors.isAuthenticatedWithOAuth(state)).to.be.false;
    });
  });
});
