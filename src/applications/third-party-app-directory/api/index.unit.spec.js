// Node modules.
import { expect } from 'chai';
// Relative imports.
import { fetchResults, fetchScopes } from './index';

describe('api functions', () => {
  describe('fetchResults', () => {
    it('should return a normalized API response', async () => {
      const apiCall = await fetchResults({ mockRequest: true });
      expect(apiCall).to.be.an('object');
    });
  });

  describe('fetchScopes', () => {
    it('should return an array of scopes', async () => {
      const apiCall = await fetchScopes('Health');
      expect(apiCall).to.be.an('object');
    });
  });
});
