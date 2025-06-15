import { expect } from 'chai';
import { hasMhvAccount } from '../../selectors';
import { appName } from '../../manifest.json';

describe(`${appName} -- hasMhvAccount`, () => {
  it('returns true when user has an MHV account', () => {
    const state = {
      user: {
        profile: {
          mhvAccountState: 'OK',
        },
      },
    };
    const result = hasMhvAccount(state);
    expect(result).to.be.true;
  });

  it('returns true when user has multiple MHV accounts', () => {
    const state = {
      user: {
        profile: {
          mhvAccountState: 'MULTIPLE',
        },
      },
    };
    const result = hasMhvAccount(state);
    expect(result).to.be.true;
  });
  it('returns false when user does not have an MHV account', () => {
    const state = {
      user: {
        profile: {
          mhvAccountState: 'NONE',
        },
      },
    };
    const result = hasMhvAccount(state);
    expect(result).to.be.false;
  });
});
