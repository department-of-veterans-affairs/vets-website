// Node modules.
import { expect } from 'chai';
// Relative imports.
import { normalizeResponse } from './index';

describe('helpers', () => {
  describe('`normalizeResponse`', () => {
    it('should return what we expect', () => {
      const response = {
        data: [
          {
            id: '1',
            attributes: { name: 'some name' },
            type: 'some type',
          },
        ],
        meta: {
          count: 227,
        },
      };

      expect(normalizeResponse(response)).to.deep.equal({
        results: [
          {
            id: '1',
            name: 'some name',
            type: 'some type',
          },
        ],
        totalResults: 227,
      });
    });
  });
});
