import { expect } from 'chai';
import { getIsPilotFromState } from '../../actions';

describe('getIsPilotFromState', () => {
  it('should return the value of isPilot from the state', () => {
    const getState = () => ({
      sm: {
        app: {
          isPilot: true,
        },
      },
    });

    const isPilot = getIsPilotFromState(getState);
    expect(isPilot).to.equal(true);
  });

  it('should return false if isPilot is not in the state', () => {
    const getState = () => ({ sm: {} });

    const isPilot = getIsPilotFromState(getState);
    expect(isPilot).to.equal(false);
  });
});
