/**
 * @module tests/schemas/veteran-identification.unit.spec
 * @description Unit tests for veteran identification validation schemas
 */

import { expect } from 'chai';
import {
  veteranFirstNameSchema,
  veteranMiddleNameSchema,
  veteranLastNameSchema,
  veteranSSNSchema,
  veteranFileNumberSchema,
  veteranDOBSchema,
  isVeteranClaimantSchema,
  veteranIdentificationSchema,
} from './veteran-identification';

describe('Veteran Identification Schemas', () => {
  describe('veteranFirstNameSchema', () => {
    it('should validate valid first name', () => {
      const result = veteranFirstNameSchema.safeParse('Boba');
      expect(result.success).to.be.true;
    });

    it('should reject empty first name', () => {
      const result = veteranFirstNameSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject first name over 30 characters', () => {
      const result = veteranFirstNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });
  });

  describe('veteranMiddleNameSchema', () => {
    it('should validate valid middle name', () => {
      const result = veteranMiddleNameSchema.safeParse('Tiberius');
      expect(result.success).to.be.true;
    });

    it('should validate empty middle name', () => {
      const result = veteranMiddleNameSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should reject middle name over 30 characters', () => {
      const result = veteranMiddleNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });
  });

  describe('veteranLastNameSchema', () => {
    it('should validate valid last name', () => {
      const result = veteranLastNameSchema.safeParse('Fett');
      expect(result.success).to.be.true;
    });

    it('should reject empty last name', () => {
      const result = veteranLastNameSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject last name over 30 characters', () => {
      const result = veteranLastNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });
  });

  describe('veteranSSNSchema', () => {
    it('should validate valid SSN', () => {
      const result = veteranSSNSchema.safeParse('123456789');
      expect(result.success).to.be.true;
    });

    it('should validate SSN with dashes', () => {
      const result = veteranSSNSchema.safeParse('123-45-6789');
      expect(result.success).to.be.true;
    });

    it('should reject invalid SSN', () => {
      const result = veteranSSNSchema.safeParse('12345');
      expect(result.success).to.be.false;
    });

    it('should reject empty SSN', () => {
      const result = veteranSSNSchema.safeParse('');
      expect(result.success).to.be.false;
    });
  });

  describe('veteranFileNumberSchema', () => {
    it('should validate 8 digit file number', () => {
      const result = veteranFileNumberSchema.safeParse('12345678');
      expect(result.success).to.be.true;
    });

    it('should validate 9 digit file number', () => {
      const result = veteranFileNumberSchema.safeParse('123456789');
      expect(result.success).to.be.true;
    });

    it('should validate empty file number', () => {
      const result = veteranFileNumberSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should reject invalid file number', () => {
      const result = veteranFileNumberSchema.safeParse('123');
      expect(result.success).to.be.false;
    });
  });

  describe('veteranDOBSchema', () => {
    it('should validate valid date', () => {
      const result = veteranDOBSchema.safeParse('1985-03-22');
      expect(result.success).to.be.true;
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      const result = veteranDOBSchema.safeParse(futureDateString);
      expect(result.success).to.be.false;
    });

    it('should reject empty date', () => {
      const result = veteranDOBSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject invalid date', () => {
      const result = veteranDOBSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
    });
  });

  describe('isVeteranClaimantSchema', () => {
    it('should validate yes', () => {
      const result = isVeteranClaimantSchema.safeParse('yes');
      expect(result.success).to.be.true;
    });

    it('should validate no', () => {
      const result = isVeteranClaimantSchema.safeParse('no');
      expect(result.success).to.be.true;
    });

    it('should reject invalid value', () => {
      const result = isVeteranClaimantSchema.safeParse('maybe');
      expect(result.success).to.be.false;
    });
  });

  describe('veteranIdentificationSchema', () => {
    it('should validate complete veteran identification', () => {
      const data = {
        veteranFirstName: 'Boba',
        veteranMiddleName: 'Tiberius',
        veteranLastName: 'Fett',
        veteranSSN: '123-45-6789',
        veteranFileNumber: '12345678',
        veteranServiceNumber: 'SVC123456',
        veteranDOB: '1985-03-22',
        isVeteranClaimant: 'yes',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate without optional fields', () => {
      const data = {
        veteranFirstName: 'Boba',
        veteranMiddleName: '',
        veteranLastName: 'Fett',
        veteranSSN: '123456789',
        veteranFileNumber: '',
        veteranServiceNumber: '',
        veteranDOB: '1985-03-22',
        isVeteranClaimant: 'no',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject missing required fields', () => {
      const data = {
        veteranMiddleName: '',
        veteranFileNumber: '',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });
});
