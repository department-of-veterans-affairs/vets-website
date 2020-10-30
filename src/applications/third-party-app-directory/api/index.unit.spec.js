// Node modules.
import { expect } from 'chai';
// Relative imports.
import { fetchResults } from './index';

describe('api functions', () => {
  describe('fetchResults', () => {
    it('should return a normalized API response', async () => {
      const apiCall = await fetchResults({ mockRequest: true });
      expect(apiCall).to.be.an('object');
    });
  });

  // TODO: update when scopes are updated
  // describe('fetchScopes', () => {
  //   it('should return an array of data permissions', async () => {
  //     const {data} = await fetchScopes();
  //     expect(data).to.be.an('object');
  //     expect(data.scopes).to.be.an('array');
  //   });
  // });
});
