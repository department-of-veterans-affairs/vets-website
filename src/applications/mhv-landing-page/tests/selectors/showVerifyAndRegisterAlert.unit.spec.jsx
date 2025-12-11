import { expect } from 'chai';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { showVerifyAndRegisterAlert } from '../../selectors';
import { appName } from '../../manifest.json';

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

describe(`${appName} -- showVerifyAndRegisterAlert`, () => {
  it('returns true when csp is ID.me and not LOA3', () => {
    state = stateFn({ loa: 1, serviceName: CSP_IDS.ID_ME });
    result = showVerifyAndRegisterAlert(state);
    expect(result).to.eq(true);
  });

  it('returns true when csp is Login.gov and not LOA3', () => {
    state = stateFn({ loa: 2, serviceName: CSP_IDS.LOGIN_GOV });
    result = showVerifyAndRegisterAlert(state);
    expect(result).to.eq(true);
  });

  it('returns false when csp is MHV', () => {
    state = stateFn({ serviceName: CSP_IDS.MHV });
    result = showVerifyAndRegisterAlert(state);
    expect(result).to.eq(false);
  });

  it('returns false when LOA3', () => {
    state = stateFn({ loa: 3 });
    result = showVerifyAndRegisterAlert(state);
    expect(result).to.eq(false);
  });
});
