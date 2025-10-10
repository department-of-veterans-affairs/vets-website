import { expect } from 'chai';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import { getListWithRetry } from '../../actions/common';

describe('getListWithRetry', () => {
  let callCount = 0;
  let clock;

  const mockedGetListNoRetry = () => {
    callCount += 1;
    return 'success';
  };

  const mockedGetListRetry = () => {
    callCount += 1;
    if (callCount < 3) return { status: 202 };
    return 'success';
  };

  beforeEach(() => {
    callCount = 0;
  });

  afterEach(() => {
    if (clock) {
      clock.restore();
      clock = null;
    }
  });

  it('returns success immediately and dispatches no actions', async () => {
    clock = sinon.useFakeTimers({ toFake: ['Date', 'setTimeout'] });
    const mockDispatch = sinon.spy();
    const startTime = Date.now();

    let result = null;
    try {
      result = await getListWithRetry(
        mockDispatch,
        mockedGetListNoRetry,
        1,
        20,
        startTime + 100,
      );
    } catch (error) {
      expect.fail('Function should not have thrown an error');
    }
    expect(result).to.equal('success');
    expect(callCount).to.equal(1);
    expect(mockDispatch.called).to.be.false;
  });

  it('times out if success is not returned quickly enough', async () => {
    // Use fake timers to control Date.now() only, let setTimeout run naturally
    clock = sinon.useFakeTimers({
      now: new Date('2024-01-01T00:00:00Z').getTime(),
      toFake: ['Date'],
    });
    const mockDispatch = sinon.spy();
    const startTime = Date.now();
    // Set timeout to 30ms - with 20ms retry delays, the function will timeout after first retry
    const endTime = startTime + 30;

    let caughtError = null;
    try {
      // Advance clock past the timeout before the function even checks
      clock.tick(35);
      await getListWithRetry(mockDispatch, mockedGetListRetry, 1, 20, endTime);
      expect.fail('Function should have thrown an error due to timeout');
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).to.exist;
    expect(caughtError.message).to.eq('Timed out while waiting for response');
    // Should timeout during retries
    expect(callCount).to.be.lessThan(3);
  });

  it('retries several times before returning successfully', async () => {
    clock = sinon.useFakeTimers({
      now: new Date('2024-01-01T00:00:00Z').getTime(),
      toFake: ['Date'],
    });
    const mockDispatch = sinon.spy();
    const startTime = Date.now();

    let result = null;
    try {
      result = await getListWithRetry(
        mockDispatch,
        mockedGetListRetry,
        1,
        20,
        startTime + 100,
      );
    } catch (error) {
      expect.fail('Function should not have thrown an error');
    }

    expect(result).to.equal('success');
    expect(callCount).to.equal(3);
    expect(
      mockDispatch.calledWith({
        type: Actions.Refresh.SET_INITIAL_FHIR_LOAD,
        payload: sinon.match.date,
      }),
    ).to.be.true;
  });
});
