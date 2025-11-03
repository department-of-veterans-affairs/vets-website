import { expect } from 'chai';
import {
  medicaidStatusSchema,
  currentMedicaidStatusSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/medicaid-status/medicaid-status';

describe('Medicaid Status Schemas', () => {
  describe('medicaidStatusSchema', () => {
    it('should validate "yes"', () => {
      const result = medicaidStatusSchema.safeParse('yes');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('yes');
    });

    it('should validate "no"', () => {
      const result = medicaidStatusSchema.safeParse('no');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('no');
    });

    it('should reject empty string', () => {
      const result = medicaidStatusSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'covered by Medicaid',
        );
      }
    });

    it('should reject invalid value', () => {
      const result = medicaidStatusSchema.safeParse('pending');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'covered by Medicaid',
        );
      }
    });

    it('should reject null', () => {
      const result = medicaidStatusSchema.safeParse(null);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'covered by Medicaid',
        );
      }
    });

    it('should reject undefined', () => {
      const result = medicaidStatusSchema.safeParse(undefined);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'covered by Medicaid',
        );
      }
    });

    it('should reject wrong case "Yes"', () => {
      const result = medicaidStatusSchema.safeParse('Yes');
      expect(result.success).to.be.false;
    });

    it('should reject wrong case "NO"', () => {
      const result = medicaidStatusSchema.safeParse('NO');
      expect(result.success).to.be.false;
    });

    it('should reject number', () => {
      const result = medicaidStatusSchema.safeParse(1);
      expect(result.success).to.be.false;
    });

    it('should reject boolean', () => {
      const result = medicaidStatusSchema.safeParse(true);
      expect(result.success).to.be.false;
    });

    it('should reject object', () => {
      const result = medicaidStatusSchema.safeParse({ covered: 'yes' });
      expect(result.success).to.be.false;
    });

    it('should reject array', () => {
      const result = medicaidStatusSchema.safeParse(['yes']);
      expect(result.success).to.be.false;
    });

    it('should export schema as a zod enum', () => {
      expect(medicaidStatusSchema).to.exist;
      expect(medicaidStatusSchema._def).to.exist;
      expect(medicaidStatusSchema._def.typeName).to.equal('ZodEnum');
    });
  });

  describe('currentMedicaidStatusSchema', () => {
    it('should validate with "yes"', () => {
      const validData = {
        currentlyCoveredByMedicaid: 'yes',
      };
      const result = currentMedicaidStatusSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.currentlyCoveredByMedicaid).to.equal('yes');
      }
    });

    it('should validate with "no"', () => {
      const validData = {
        currentlyCoveredByMedicaid: 'no',
      };
      const result = currentMedicaidStatusSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.currentlyCoveredByMedicaid).to.equal('no');
      }
    });

    it('should reject missing currentlyCoveredByMedicaid', () => {
      const invalidData = {};
      const result = currentMedicaidStatusSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty currentlyCoveredByMedicaid', () => {
      const invalidData = {
        currentlyCoveredByMedicaid: '',
      };
      const result = currentMedicaidStatusSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid currentlyCoveredByMedicaid', () => {
      const invalidData = {
        currentlyCoveredByMedicaid: 'invalid',
      };
      const result = currentMedicaidStatusSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null currentlyCoveredByMedicaid', () => {
      const invalidData = {
        currentlyCoveredByMedicaid: null,
      };
      const result = currentMedicaidStatusSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject undefined currentlyCoveredByMedicaid', () => {
      const invalidData = {
        currentlyCoveredByMedicaid: undefined,
      };
      const result = currentMedicaidStatusSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject whitespace-only string', () => {
      const invalidData = {
        currentlyCoveredByMedicaid: '   ',
      };
      const result = currentMedicaidStatusSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should handle complex invalid types gracefully', () => {
      const invalidData = {
        currentlyCoveredByMedicaid: new Date(),
      };
      const result = currentMedicaidStatusSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should have shape property with currentlyCoveredByMedicaid field', () => {
      expect(currentMedicaidStatusSchema.shape).to.exist;
      expect(currentMedicaidStatusSchema.shape.currentlyCoveredByMedicaid).to
        .exist;
    });

    it('should export schema as a zod object', () => {
      expect(currentMedicaidStatusSchema).to.exist;
      expect(currentMedicaidStatusSchema._def).to.exist;
      expect(currentMedicaidStatusSchema._def.typeName).to.equal('ZodObject');
    });
  });
});
