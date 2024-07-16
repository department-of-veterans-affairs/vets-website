import { expect } from 'chai';
import { hasMhvBasicAccount } from '../../selectors';
import { appName } from '../../manifest.json';

describe(`${appName} -- hasMhvBasicAccount`, () => {
  it('returns true when user is LOA1 and has an MHV account', () => {
    const state = {
      user: {
        profile: {
          loa: { current: 1 },
          mhvAccountState: 'OK',
        },
      },
    };
    const result = hasMhvBasicAccount(state);
    expect(result).to.be.true;
  });

  it('returns false when user is not LOA1', () => {
    const state = {
      user: {
        profile: {
          loa: { current: 3 },
          mhvAccountState: 'OK',
        },
      },
    };
    const result = hasMhvBasicAccount(state);
    expect(result).to.be.false;
  });

  it('returns false when user does not have an MHV account', () => {
    const state = {
      user: {
        profile: {
          loa: { current: 1 },
          mhvAccountState: 'NONE',
        },
      },
    };
    const result = hasMhvBasicAccount(state);
    expect(result).to.be.false;
  });
});
