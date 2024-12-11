import { expect } from 'chai';
import { validateFacilityCode } from '../utilities';

global.window = { location: { href: '' } };

const mockApiRequest = async url => {
  if (url.includes('31850932')) {
    return { data: { attributes: { accredited: true } } };
  }
  if (url.includes('123')) {
    throw new Error('API error');
  }
  return null;
};

describe('Utilities Tests', () => {
  describe('validateFacilityCode', () => {
    beforeEach(() => {
      global.apiRequest = mockApiRequest;
    });

    it('should return accredited status from API', async () => {
      const field = {
        institutionDetails: {
          facilityCode: '31850932',
          institutionName: 'test',
          startDate: '2024-01-01',
        },
      };

      const result = await validateFacilityCode(field);

      expect(result).to.be.true;
    });

    it('should return false on API error', async () => {
      const field = { institutionDetails: { facilityCode: '123' } };

      const result = await validateFacilityCode(field);

      expect(result).to.be.false;
    });
  });
});
