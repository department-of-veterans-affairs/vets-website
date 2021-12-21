import { expect } from 'chai';

import { makeApiCall } from './index';

describe('Pre check in', () => {
  describe('api utils', () => {
    describe('makeApiCall', () => {
      it('makeApiCall invokes promise', async () => {
        const testPromise = new Promise(resolve => {
          const sample = { data: { hello: 'world' } };
          resolve(sample);
        });
        const result = await makeApiCall(testPromise);
        expect(result).to.deep.equal({ data: { hello: 'world' } });
      });
      it('makeApiCall invokes promise with error', async () => {
        const testPromise = new Promise(resolve => {
          const sample = { data: { hello: 'world', error: 'no error' } };
          resolve(sample);
        });
        const result = await makeApiCall(testPromise);
        expect(result).to.deep.equal({
          data: { hello: 'world', error: 'no error' },
        });
      });
      it('failed api call is caught', async () => {
        const testPromise = new Promise((resolve, reject) => {
          reject(new Error('failed'));
        });
        await expect(makeApiCall(testPromise)).to.be.rejectedWith('failed');
      });
    });
  });
});
