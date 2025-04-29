import { expect } from 'chai';
import { depends } from '../../pages/ancillaryFormsWizardSummary';

describe('526 All Claims -- Ancillary forms wizard summary', () => {
  describe('depends', () => {
    it('should return true if one of the ancillary forms questions is answered true', () => {
      expect(depends({ 'view:modifyingHome': true })).to.be.true;
      expect(depends({ 'view:modifyingCar': true })).to.be.true;
      expect(depends({ 'view:aidAndAttendance': true })).to.be.true;
      expect(depends({ 'view:unemployable': true })).to.be.true;
    });

    it('should return false if none of the ancillary forms questions is answered true', () => {
      expect(depends({ foo: true })).to.be.false;
    });
  });
});
