import { expect } from 'chai';
import { hasHealthData } from '../../selectors';
import { appName } from '../../manifest.json';

describe(`${appName} -- hasHealthData selector`, () => {
  it('user has facilities', () => {
    const state = {
      user: {
        profile: {
          facilities: [{ facilityId: '655', isCerner: false }],
        },
      },
    };
    const result = hasHealthData(state);
    expect(result).to.be.true;
  });

  it('user has no facilities', () => {
    const state = {
      user: {
        profile: {
          facilities: [],
        },
      },
    };
    const result = hasHealthData(state);
    expect(result).to.be.false;
  });

  it('user state has no facilities property', () => {
    const state = {
      user: {},
    };
    const result = hasHealthData(state);
    expect(result).to.be.false;
  });
});
