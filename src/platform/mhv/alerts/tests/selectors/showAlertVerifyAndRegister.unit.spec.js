import { expect } from 'chai';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { showAlertVerifyAndRegister } from '../../selectors';

const stateFn = ({ loa = 3, serviceName = CSP_IDS.ID_ME } = {}) => ({
  user: {
    profile: {
      signIn: {
        serviceName,
      },
      loa: {
        current: loa,
      },
    },
  },
});

let result;
let state;

describe('showAlertVerifyAndRegister', () => {
  it('returns true when csp is ID.me and not LOA3', () => {
    state = stateFn({ loa: 1, serviceName: CSP_IDS.ID_ME });
    result = showAlertVerifyAndRegister(state);
    expect(result).to.eq(true);
  });

  it('returns true when csp is Login.gov and not LOA3', () => {
    state = stateFn({ loa: 2, serviceName: CSP_IDS.LOGIN_GOV });
    result = showAlertVerifyAndRegister(state);
    expect(result).to.eq(true);
  });

  it('returns false when csp is MHV', () => {
    state = stateFn({ serviceName: CSP_IDS.MHV });
    result = showAlertVerifyAndRegister(state);
    expect(result).to.eq(false);
  });

  it('returns false when csp is DSLogon', () => {
    state = stateFn({ serviceName: CSP_IDS.DS_LOGON });
    result = showAlertVerifyAndRegister(state);
    expect(result).to.eq(false);
  });

  it('returns false when LOA3', () => {
    state = stateFn({ loa: 3 });
    result = showAlertVerifyAndRegister(state);
    expect(result).to.eq(false);
  });
});
