import { expect } from 'chai';
import sinon from 'sinon';
import retryOnce from '../../../webchat/utils/retryOnce';

describe('retryOnce', () => {
  it('should return the result of the retryable function if it succeeds', async () => {
    const retryableFunction = sinon.stub().resolves('success');
    const result = await retryOnce(retryableFunction);
    expect(result).to.equal('success');
    expect(retryableFunction.callCount).to.equal(1);
  });

  it('should retry the function once if it fails and return the result', async () => {
    const retryableFunction = sinon.stub();
    retryableFunction.onFirstCall().rejects(new Error('failure'));
    retryableFunction.onSecondCall().resolves('success');
    const result = await retryOnce(retryableFunction);
    expect(result).to.equal('success');
    expect(retryableFunction.callCount).to.equal(2);
  });

  it('should throw an error if the retryable function fails twice', async () => {
    const retryableFunction = sinon.stub().rejects(new Error('failure'));
    try {
      await retryOnce(retryableFunction);
    } catch (error) {
      expect(error.message).to.equal('failure');
    }
    expect(retryableFunction.callCount).to.equal(2);
  });
});
