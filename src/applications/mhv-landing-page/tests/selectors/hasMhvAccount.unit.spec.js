import { expect } from 'chai';
import { hasMhvAccount } from '../../selectors';
import { appName } from '../../manifest.json';

describe(`${appName} -- hasMhvAccount selector`, () => {
  it('user has MHV account', () => {
    const state = {
      user: {
        profile: {
          mhvAccount: {
            termsAndConditionsAccepted: true,
          },
        },
      },
    };
    const result = hasMhvAccount(state);
    expect(result).to.be.true;
  });

  it('user has no MHV account', () => {
    const state = {
      user: {
        profile: {
          mhvAccount: {
            termsAndConditionsAccepted: false,
          },
        },
      },
    };
    const result = hasMhvAccount(state);
    expect(result).to.be.false;
  });

  it('user state has no profile property', () => {
    const state = {
      user: {},
    };
    const result = hasMhvAccount(state);
    expect(result).to.be.false;
  });
});
