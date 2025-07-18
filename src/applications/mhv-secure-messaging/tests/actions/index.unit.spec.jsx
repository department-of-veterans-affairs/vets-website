import { expect } from 'chai';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { getIsPilotFromState } from '../../actions';

describe('getIsPilotFromState', () => {
  it('should return the value of isPilot from the state', () => {
    const getState = () => ({
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: true,
      },
    });

    const isPilot = getIsPilotFromState(getState);
    expect(isPilot).to.equal(true);
  });

  it('should return false if isPilot is not in the state', () => {
    const getState = () => ({ featureToggles: {} });

    const isPilot = getIsPilotFromState(getState);
    expect(isPilot).to.equal(false);
  });
});
