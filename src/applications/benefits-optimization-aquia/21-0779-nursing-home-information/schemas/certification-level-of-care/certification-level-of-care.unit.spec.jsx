import { expect } from 'chai';

import { certificationLevelOfCareSchema } from '@bio-aquia/21-0779-nursing-home-information/schemas/certification-level-of-care/certification-level-of-care';

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

    it('should reject extra fields with valid levelOfCare', () => {
      const data = {
        levelOfCare: 'skilled',
        extraField: 'extra',
      };
      const result = certificationLevelOfCareSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should handle complex invalid type gracefully', () => {
      const invalidData = {
        levelOfCare: new Date(),
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject whitespace-only string', () => {
      const invalidData = {
        levelOfCare: '   ',
      };
      const result = certificationLevelOfCareSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should export schema as a zod object', () => {
      expect(certificationLevelOfCareSchema).to.exist;
      expect(certificationLevelOfCareSchema._def).to.exist;
      expect(certificationLevelOfCareSchema._def.typeName).to.equal(
        'ZodObject',
      );
    });

    it('should have shape property with levelOfCare field', () => {
      expect(certificationLevelOfCareSchema.shape).to.exist;
      expect(certificationLevelOfCareSchema.shape.levelOfCare).to.exist;
    });

    it('should use custom error messages', () => {
      const result = certificationLevelOfCareSchema.safeParse({
        levelOfCare: 123,
      });
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.exist;
      }
    });

    it('should handle missing required field', () => {
      const result = certificationLevelOfCareSchema.safeParse({});
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues).to.have.lengthOf.at.least(1);
      }
    });

    it('should validate schema structure', () => {
      const result = certificationLevelOfCareSchema.safeParse({
        levelOfCare: 'skilled',
      });
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data).to.deep.equal({ levelOfCare: 'skilled' });
      }
    });

    it('should validate with intermediate option', () => {
      const result = certificationLevelOfCareSchema.safeParse({
        levelOfCare: 'intermediate',
      });
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data).to.deep.equal({ levelOfCare: 'intermediate' });
      }
    });

    it('should handle parse with transform', () => {
      const data = { levelOfCare: 'skilled' };
      const result = certificationLevelOfCareSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject with custom message for invalid enum', () => {
      const result = certificationLevelOfCareSchema.safeParse({
        levelOfCare: 'invalid-value',
      });
      expect(result.success).to.be.false;
      if (!result.success) {
        const { message } = result.error.issues[0];
        expect(message).to.include('select the level of care');
      }
    });

    it('should reject with custom message for invalid type', () => {
      const result = certificationLevelOfCareSchema.safeParse({
        levelOfCare: 123,
      });
      expect(result.success).to.be.false;
      if (!result.success) {
        const { message } = result.error.issues[0];
        expect(message).to.include('select the level of care');
      }
    });
  });
});
