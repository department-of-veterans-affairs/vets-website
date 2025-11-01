/**
 * Unit tests for certification level of care schemas
 */

import { expect } from 'chai';
import { certificationLevelOfCareSchema } from './certification-level-of-care';

describe('Certification Level of Care Schemas', () => {
  describe('certificationLevelOfCareSchema', () => {
    it('should validate "skilled" as level of care', () => {
      const validData = {
        levelOfCare: 'skilled',
      };
      const result = certificationLevelOfCareSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.levelOfCare).to.equal('skilled');
      }
    });

    it('should validate "intermediate" as level of care', () => {
      const validData = {
        levelOfCare: 'intermediate',
      };
      const result = certificationLevelOfCareSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.levelOfCare).to.equal('intermediate');
      }
    });

    it('should reject empty string', () => {
      const invalidData = {
        levelOfCare: '',
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'select the level of care',
        );
      }
    });

    it('should reject invalid value', () => {
      const invalidData = {
        levelOfCare: 'advanced',
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'select the level of care',
        );
      }
    });

    it('should reject null', () => {
      const invalidData = {
        levelOfCare: null,
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'select the level of care',
        );
      }
    });

    it('should reject undefined', () => {
      const invalidData = {
        levelOfCare: undefined,
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'select the level of care',
        );
      }
    });

    it('should reject wrong case "Skilled"', () => {
      const invalidData = {
        levelOfCare: 'Skilled',
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject wrong case "INTERMEDIATE"', () => {
      const invalidData = {
        levelOfCare: 'INTERMEDIATE',
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject number', () => {
      const invalidData = {
        levelOfCare: 1,
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject boolean', () => {
      const invalidData = {
        levelOfCare: true,
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject object', () => {
      const invalidData = {
        levelOfCare: { type: 'skilled' },
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject array', () => {
      const invalidData = {
        levelOfCare: ['skilled'],
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing levelOfCare field', () => {
      const invalidData = {};
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject partial match', () => {
      const invalidData = {
        levelOfCare: 'skill',
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject close but wrong spelling', () => {
      const invalidData = {
        levelOfCare: 'intermidiate',
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
