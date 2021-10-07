import { expect } from 'chai';

import { makeApiCall } from './index';

describe('check in', () => {
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
    });
  });
});
