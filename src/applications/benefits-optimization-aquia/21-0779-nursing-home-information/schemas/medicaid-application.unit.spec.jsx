/**
 * Unit tests for medicaid application schemas
 */

import { expect } from 'chai';
import {
  medicaidApplicationStatusSchema,
  medicaidApplicationSchema,
} from './medicaid-application';

describe('Medicaid Application Schemas', () => {
  describe('medicaidApplicationStatusSchema', () => {
    it('should validate "yes"', () => {
      const result = medicaidApplicationStatusSchema.safeParse('yes');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('yes');
    });

    it('should validate "no"', () => {
      const result = medicaidApplicationStatusSchema.safeParse('no');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('no');
    });

    it('should reject empty string', () => {
      const result = medicaidApplicationStatusSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'applied for Medicaid',
        );
      }
    });

    it('should reject invalid value', () => {
      const result = medicaidApplicationStatusSchema.safeParse('pending');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'applied for Medicaid',
        );
      }
    });

    it('should reject null', () => {
      const result = medicaidApplicationStatusSchema.safeParse(null);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'applied for Medicaid',
        );
      }
    });

    it('should reject undefined', () => {
      const result = medicaidApplicationStatusSchema.safeParse(undefined);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'applied for Medicaid',
        );
      }
    });

    it('should reject wrong case "Yes"', () => {
      const result = medicaidApplicationStatusSchema.safeParse('Yes');
      expect(result.success).to.be.false;
    });

    it('should reject wrong case "NO"', () => {
      const result = medicaidApplicationStatusSchema.safeParse('NO');
      expect(result.success).to.be.false;
    });

    it('should reject number', () => {
      const result = medicaidApplicationStatusSchema.safeParse(1);
      expect(result.success).to.be.false;
    });

    it('should reject boolean', () => {
      const result = medicaidApplicationStatusSchema.safeParse(true);
      expect(result.success).to.be.false;
    });

    it('should reject object', () => {
      const result = medicaidApplicationStatusSchema.safeParse({
        status: 'yes',
      });
      expect(result.success).to.be.false;
    });

    it('should reject array', () => {
      const result = medicaidApplicationStatusSchema.safeParse(['yes']);
      expect(result.success).to.be.false;
    });
  });

  describe('medicaidApplicationSchema', () => {
    it('should validate with "yes"', () => {
      const validData = {
        hasAppliedForMedicaid: 'yes',
      };
      const result = medicaidApplicationSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.hasAppliedForMedicaid).to.equal('yes');
      }
    });

    it('should validate with "no"', () => {
      const validData = {
        hasAppliedForMedicaid: 'no',
      };
      const result = medicaidApplicationSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.hasAppliedForMedicaid).to.equal('no');
      }
    });

    it('should reject missing hasAppliedForMedicaid', () => {
      const invalidData = {};
      const result = medicaidApplicationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty hasAppliedForMedicaid', () => {
      const invalidData = {
        hasAppliedForMedicaid: '',
      };
      const result = medicaidApplicationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid hasAppliedForMedicaid', () => {
      const invalidData = {
        hasAppliedForMedicaid: 'invalid',
      };
      const result = medicaidApplicationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null hasAppliedForMedicaid', () => {
      const invalidData = {
        hasAppliedForMedicaid: null,
      };
      const result = medicaidApplicationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject undefined hasAppliedForMedicaid', () => {
      const invalidData = {
        hasAppliedForMedicaid: undefined,
      };
      const result = medicaidApplicationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
