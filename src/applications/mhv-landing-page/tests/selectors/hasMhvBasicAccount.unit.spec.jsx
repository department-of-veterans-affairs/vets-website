import { expect } from 'chai';
import { hasMhvBasicAccount } from '../../selectors';
import { appName } from '../../manifest.json';

describe(`${appName} -- hasMhvBasicAccount`, () => {
  it('returns true when user is LOA1 and has a basic MHV account', () => {
    const state = {
      user: {
        profile: {
          loa: { current: 1 },
          mhvAccountState: 'OK',
          signIn: {
            serviceName: 'mhv',
          },
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
          signIn: {
            serviceName: 'idme',
          },
        },
      },
    };
    const result = hasMhvBasicAccount(state);
    expect(result).to.be.false;
  });
});
