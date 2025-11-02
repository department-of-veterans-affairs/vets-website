/**
 * Unit tests for medicaid facility schemas
 */

import { expect } from 'chai';
import {
  medicaidFacilityStatusSchema,
  medicaidFacilitySchema,
} from './medicaid-facility';

describe('Medicaid Facility Schemas', () => {
  describe('medicaidFacilityStatusSchema', () => {
    it('should validate "yes"', () => {
      const result = medicaidFacilityStatusSchema.safeParse('yes');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('yes');
    });

    it('should validate "no"', () => {
      const result = medicaidFacilityStatusSchema.safeParse('no');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('no');
    });

    it('should reject empty string', () => {
      const result = medicaidFacilityStatusSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Medicaid-approved facility',
        );
      }
    });

    it('should reject invalid value', () => {
      const result = medicaidFacilityStatusSchema.safeParse('maybe');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Medicaid-approved facility',
        );
      }
    });

    it('should reject null', () => {
      const result = medicaidFacilityStatusSchema.safeParse(null);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Medicaid-approved facility',
        );
      }
    });

    it('should reject undefined', () => {
      const result = medicaidFacilityStatusSchema.safeParse(undefined);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Medicaid-approved facility',
        );
      }
    });

    it('should reject wrong case "Yes"', () => {
      const result = medicaidFacilityStatusSchema.safeParse('Yes');
      expect(result.success).to.be.false;
    });

    it('should reject wrong case "NO"', () => {
      const result = medicaidFacilityStatusSchema.safeParse('NO');
      expect(result.success).to.be.false;
    });

    it('should reject number', () => {
      const result = medicaidFacilityStatusSchema.safeParse(1);
      expect(result.success).to.be.false;
    });

    it('should reject boolean true', () => {
      const result = medicaidFacilityStatusSchema.safeParse(true);
      expect(result.success).to.be.false;
    });

    it('should reject boolean false', () => {
      const result = medicaidFacilityStatusSchema.safeParse(false);
      expect(result.success).to.be.false;
    });

    it('should reject object', () => {
      const result = medicaidFacilityStatusSchema.safeParse({ value: 'yes' });
      expect(result.success).to.be.false;
    });

    it('should reject array', () => {
      const result = medicaidFacilityStatusSchema.safeParse(['yes']);
      expect(result.success).to.be.false;
    });
  });

  describe('medicaidFacilitySchema', () => {
    it('should validate with "yes"', () => {
      const validData = {
        isMedicaidApproved: 'yes',
      };
      const result = medicaidFacilitySchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.isMedicaidApproved).to.equal('yes');
      }
    });

    it('should validate with "no"', () => {
      const validData = {
        isMedicaidApproved: 'no',
      };
      const result = medicaidFacilitySchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.isMedicaidApproved).to.equal('no');
      }
    });

    it('should reject missing isMedicaidApproved', () => {
      const invalidData = {};
      const result = medicaidFacilitySchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty isMedicaidApproved', () => {
      const invalidData = {
        isMedicaidApproved: '',
      };
      const result = medicaidFacilitySchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid isMedicaidApproved', () => {
      const invalidData = {
        isMedicaidApproved: 'invalid',
      };
      const result = medicaidFacilitySchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null isMedicaidApproved', () => {
      const invalidData = {
        isMedicaidApproved: null,
      };
      const result = medicaidFacilitySchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject undefined isMedicaidApproved', () => {
      const invalidData = {
        isMedicaidApproved: undefined,
      };
      const result = medicaidFacilitySchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
