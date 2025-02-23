import { expect } from 'chai';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { showAlertMhvBasicAccount } from '../../selectors';

const stateFn = ({
  loa = 3,
  serviceName = CSP_IDS.MHV,
  mhvAccountState = 'OK',
} = {}) => ({
  user: {
    profile: {
      signIn: {
        serviceName,
      },
      loa: {
        current: loa,
      },
      mhvAccountState,
    },
  },
});

let result;
let state;

describe('showAlertMhvBasicAccount', () => {
  it('returns true when csp is MHV and LOA1', () => {
    state = stateFn({ loa: 1, serviceName: CSP_IDS.MHV });
    result = showAlertMhvBasicAccount(state);
    expect(result).to.eq(true);
  });

  it('returns false when csp is Login.gov and LOA1', () => {
    state = stateFn({ loa: 1, serviceName: CSP_IDS.LOGIN_GOV });
    result = showAlertMhvBasicAccount(state);
    expect(result).to.eq(false);
  });

  it('returns false when csp is MHV and LOA3', () => {
    state = stateFn({ serviceName: CSP_IDS.MHV });
    result = showAlertMhvBasicAccount(state);
    expect(result).to.eq(false);
  });

  it('returns false when csp is DSLogon', () => {
    state = stateFn({ serviceName: CSP_IDS.DS_LOGON });
    result = showAlertMhvBasicAccount(state);
    expect(result).to.eq(false);
  });
});
