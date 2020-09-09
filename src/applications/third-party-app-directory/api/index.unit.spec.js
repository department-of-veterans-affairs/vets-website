// Node modules.
import { expect } from 'chai';
// Relative imports.
import { fetchResultsApi } from './index';

describe('api functions', () => {
  describe('fetchResultsApi', () => {
    it('should return a normalized API response', async () => {
      const apiCall = await fetchResultsApi({ mockRequest: true });
      expect(apiCall).to.be.an('object');
    });
  });
});
