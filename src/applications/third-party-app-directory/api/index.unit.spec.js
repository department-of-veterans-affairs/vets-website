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
});
