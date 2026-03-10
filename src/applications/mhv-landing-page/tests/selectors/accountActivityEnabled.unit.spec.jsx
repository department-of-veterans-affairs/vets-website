/* eslint-disable camelcase */
import { expect } from 'chai';
import { accountActivityEnabled } from '../../selectors';

describe('My HealtheVet on VA.gov -- accountActivityEnabled selector', () => {
  it('returns true when the feature toggle is enabled', () => {
    const state = {
      featureToggles: { mhv_account_activity_log_enabled: true },
    };
    expect(accountActivityEnabled(state)).to.be.true;
  });

  it('returns false when the feature toggle is disabled', () => {
    const state = {
      featureToggles: { mhv_account_activity_log_enabled: false },
    };
    expect(accountActivityEnabled(state)).to.be.false;
  });

  it('returns undefined when the toggle is not present', () => {
    const state = { featureToggles: {} };
    expect(accountActivityEnabled(state)).to.be.undefined;
  });
});
