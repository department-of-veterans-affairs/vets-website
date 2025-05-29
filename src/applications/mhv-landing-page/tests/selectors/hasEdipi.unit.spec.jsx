import { expect } from 'chai';
import { hasEdipi } from '../../selectors';
import { appName } from '../../manifest.json';

describe(`${appName} -- hasEdipi`, () => {
  it('returns true when user has an Eidpi', () => {
    const state = {
      user: {
        profile: {
          edipi: 12345,
        },
      },
    };
    const result = hasEdipi(state);
    expect(result).to.be.true;
  });

  it('returns false when user does not have an Eidpi', () => {
    const state = {
      user: {
        profile: {
          edipi: null,
        },
      },
    };
    const result = hasEdipi(state);
    expect(result).to.be.false;
  });
});
