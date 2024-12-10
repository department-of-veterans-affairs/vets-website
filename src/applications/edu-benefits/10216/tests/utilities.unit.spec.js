import { expect } from 'chai';
import sinon from 'sinon';
import { validateFacilityCode } from '../utilities';

global.window = { location: { href: '' } };

describe('Utilities Tests', () => {
  describe('validateFacilityCode', () => {
    let apiRequestStub;

    beforeEach(() => {
      apiRequestStub = sinon.stub();
    });

    it('should return accredited status from API', async () => {
      const field = {
        institutionDetails: {
          facilityCode: '31850932',
          institutionName: 'test',
          startDate: '2024-01-01',
        },
      };
      const mockResponse = { data: { attributes: { accredited: true } } };
      apiRequestStub.returns(Promise.resolve(mockResponse));

      const result = await validateFacilityCode(field);

      expect(result).to.be.true;
    });
    it('should return false on API error', async () => {
      const field = { institutionDetails: { facilityCode: '123' } };

      apiRequestStub.returns(Promise.reject(new Error('API error')));

      const result = await validateFacilityCode(field);

      expect(result).to.be.false;
    });
  });
});
