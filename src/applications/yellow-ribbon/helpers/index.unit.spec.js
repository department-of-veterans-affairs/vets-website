// Dependencies.
import { capitalize, normalizeResponse } from './index';

describe('Yellow Ribbon helpers', () => {
  describe('`capitalize`', () => {
    it('should capitalize university names', () => {
      const name = 'colorado UNIVERSITY';

      expect(capitalize(name)).toBe('Colorado University');
    });
  });

  describe('`normalizeResponse`', () => {
    it('should return what we expect', () => {
      const response = {
        data: [
          {
            id: '1',
            attributes: { name: 'colorado university' },
            type: 'school',
          },
        ],
        meta: {
          count: 227,
        },
      };

      expect(normalizeResponse(response)).toEqual({
        results: [
          {
            id: '1',
            name: 'colorado university',
            type: 'school',
          },
        ],
        totalResults: 227,
      });
    });
  });
});
