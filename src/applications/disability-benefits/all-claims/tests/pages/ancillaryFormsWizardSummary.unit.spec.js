import { depends } from '../../pages/ancillaryFormsWizardSummary';

describe('526 All Claims -- Ancillary forms wizard summary', () => {
  describe('depends', () => {
    it('should return true if one of the ancillary forms questions is answered true', () => {
      expect(depends({ 'view:modifyingHome': true })).toBe(true);
      expect(depends({ 'view:modifyingCar': true })).toBe(true);
      expect(depends({ 'view:aidAndAttendance': true })).toBe(true);
      expect(depends({ 'view:unemployable': true })).toBe(true);
    });

    it('should return false if none of the ancillary forms questions is answered true', () => {
      expect(depends({ foo: true })).toBe(false);
    });
  });
});
