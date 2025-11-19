import { expect } from 'chai';
import { isMedicaidCovered } from './medicaidStatus';

describe('medicaidStatus utilities', () => {
  describe('isMedicaidCovered', () => {
    it('should return true when currently covered by Medicaid', () => {
      const formData = {
        medicaidStatus: {
          currentlyCoveredByMedicaid: true,
        },
      };
      expect(isMedicaidCovered(formData)).to.be.true;
    });

    it('should return false when not covered by Medicaid', () => {
      const formData = {
        medicaidStatus: {
          currentlyCoveredByMedicaid: false,
        },
      };
      expect(isMedicaidCovered(formData)).to.be.false;
    });

    it('should return false when formData is null', () => {
      expect(isMedicaidCovered(null)).to.be.false;
    });

    it('should return false when formData is undefined', () => {
      expect(isMedicaidCovered(undefined)).to.be.false;
    });

    it('should return false when formData is an array', () => {
      expect(isMedicaidCovered([])).to.be.false;
    });

    it('should return false when formData is not an object', () => {
      expect(isMedicaidCovered('string')).to.be.false;
    });

    it('should return false when medicaidStatus is missing', () => {
      const formData = {};
      expect(isMedicaidCovered(formData)).to.be.false;
    });

    it('should return false when currentlyCoveredByMedicaid is undefined', () => {
      const formData = {
        medicaidStatus: {},
      };
      expect(isMedicaidCovered(formData)).to.be.false;
    });
  });
});
