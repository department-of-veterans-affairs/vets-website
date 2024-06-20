import { expect } from 'chai';
import { getRealFacilityId } from '../../utils/appointment';

describe('VAOS appointment helpers', () => {
  describe('getRealFacilityId', () => {
    it('should return the real facility id for not production environemnts', () => {
      expect(getRealFacilityId('983')).to.equal('442');
      expect(getRealFacilityId('984')).to.equal('552');
    });
  });
});
