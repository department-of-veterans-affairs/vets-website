import { expect } from 'chai';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import { getListWithRetry } from '../../actions/common';

describe('getListWithRetry', () => {
  let callCount = 0;

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

  it('returns success immediately and dispatches no actions', async () => {
    const mockDispatch = sinon.spy();
    let result = null;
    try {
      result = await getListWithRetry(
        mockDispatch,
        mockedGetListNoRetry,
        200,
        Date.now() + 100,
      );
    } catch (error) {
      expect.fail('Function should not have thrown an error');
    }
    expect(result).to.equal('success');
    expect(callCount).to.equal(1);
    expect(mockDispatch.called).to.be.false;
  });

  it('times out if success is not returned quickly enough', async () => {
    const mockDispatch = sinon.spy();
    try {
      await getListWithRetry(
        mockDispatch,
        mockedGetListRetry,
        200,
        Date.now() + 100,
      );
      expect.fail('Function should have thrown an error due to timeout');
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.eq('Timed out while waiting for response');
      expect(callCount).to.be.lessThan(3);
    }
  });

  it('retries several times before returning successfully', async () => {
    const mockDispatch = sinon.spy();
    let result = null;
    try {
      result = await getListWithRetry(
        mockDispatch,
        mockedGetListRetry,
        200,
        Date.now() + 500,
      );
    } catch (error) {
      expect.fail('Function should not have thrown an error');
    }
    expect(result).to.equal('success');
    expect(callCount).to.equal(3);
    expect(
      mockDispatch.calledWith({
        type: Actions.Refresh.SET_INITIAL_FHIR_LOAD,
      }),
    ).to.be.true;
  });
});
