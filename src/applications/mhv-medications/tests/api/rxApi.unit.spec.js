import { expect } from 'chai';
import { testableApiRequestWithRetry } from '../../api/rxApi';

describe('apiRequestWithRetry', () => {
  let callCount = 0;

  const mockedApiRequest = async () => {
    // Return a 202 ACCEPTED response twice, then return success on the third try.
    callCount += 1;
    if (callCount < 3) {
      return { status: 202 };
    }
    return 'success';
  };

  beforeEach(() => {
    callCount = 0;
  });

  it('times out if success is not returned quickly enough', async () => {
    try {
      const endTime = Date.now() + 100;
      await testableApiRequestWithRetry(200, mockedApiRequest)(
        'http://example.com/api',
        {},
        endTime,
      );
      expect.fail('Function should have thrown an error due to timeout');
    } catch (error) {
      expect(error).to.exist;
      expect(callCount).to.be.lessThan(5);
    }
  });

  it('retries several times before returning successfully', async () => {
    try {
      const endTime = Date.now() + 5000;
      const result = await testableApiRequestWithRetry(200, mockedApiRequest)(
        'http://example.com/api',
        {},
        endTime,
      );
      expect(result).to.equal('success');
      expect(callCount).to.be.greaterThan(1);
    } catch (error) {
      expect.fail('Function should not have thrown an error');
    }
  });
});
