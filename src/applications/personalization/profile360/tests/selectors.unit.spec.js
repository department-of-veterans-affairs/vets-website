import { expect } from 'chai';
import * as selectors from '../selectors';

describe('profileShowDirectDeposit selector', () => {
  it('returns `true` if the `profileShowDirectDeposit` toggle value is set to `true`', () => {
    const state = {
      featureToggles: {
        profileShowDirectDeposit: true,
      },
    };
    expect(selectors.profileShowDirectDeposit(state)).to.be.true;
  });
  it('returns `false` if the `profileShowDirectDeposit` toggle value is set to `false`', () => {
    const state = {
      featureToggles: {
        profileShowDirectDeposit: false,
      },
    };
    expect(selectors.profileShowDirectDeposit(state)).to.be.false;
  });
  it('returns `undefined` if the `profileShowDirectDeposit` toggle value is not set', () => {
    const state = {
      featureToggles: {
        anotherFeatureFlagID: true,
      },
    };
    expect(selectors.profileShowDirectDeposit(state)).to.be.undefined;
  });
  it('returns `undefined` if the `featureToggles` are not set on the Redux store', () => {
    const state = {};
    expect(selectors.profileShowDirectDeposit(state)).to.be.undefined;
  });
});
