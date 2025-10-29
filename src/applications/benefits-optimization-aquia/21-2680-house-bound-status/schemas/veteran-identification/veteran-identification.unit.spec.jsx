/**
 * @module tests/schemas/veteran-identification.unit.spec
 * @description Unit tests for veteran identification validation schemas
 */

import { expect } from 'chai';
import { fullNameSchema } from '@bio-aquia/shared/schemas/name';
import {
  veteranSSNSchema,
  veteranFileNumberSchema,
  veteranServiceNumberSchema,
  veteranDOBSchema,
  isVeteranClaimantSchema,
  veteranIdentificationSchema,
} from './veteran-identification';

describe('Veteran Identification Validation Schemas', () => {
  describe('veteranSSNSchema', () => {
    it('should validate valid SSN', () => {
      const result = veteranSSNSchema.safeParse('123456789');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('123456789');
    });

    it('should validate SSN with dashes and strip them', () => {
      const result = veteranSSNSchema.safeParse('123-45-6789');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('123456789');
    });

    it('should reject SSN with too few digits', () => {
      const result = veteranSSNSchema.safeParse('12345');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('SSN must be 9 digits');
    });

    it('should reject SSN with too many digits', () => {
      const result = veteranSSNSchema.safeParse('1234567890');
      expect(result.success).to.be.false;
    });

    it('should reject SSN with letters', () => {
      const result = veteranSSNSchema.safeParse('12345678A');
      expect(result.success).to.be.false;
    });

    it('should reject empty SSN', () => {
      const result = veteranSSNSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Social Security Number is required',
      );
    });

    it('should reject null SSN', () => {
      const result = veteranSSNSchema.safeParse(null);
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

    it('should validate undefined file number', () => {
      const result = veteranFileNumberSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should reject file number with too few digits', () => {
      const result = veteranFileNumberSchema.safeParse('123');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'must be 8 or 9 digits',
      );
    });

    it('should reject file number with too many digits', () => {
      const result = veteranFileNumberSchema.safeParse('1234567890');
      expect(result.success).to.be.false;
    });

    it('should reject file number with letters', () => {
      const result = veteranFileNumberSchema.safeParse('1234567A');
      expect(result.success).to.be.false;
    });
  });

  describe('veteranDOBSchema', () => {
    it('should validate valid date', () => {
      const result = veteranDOBSchema.safeParse('1985-03-22');
      expect(result.success).to.be.true;
    });

    it('should validate today as date of birth', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = veteranDOBSchema.safeParse(today);
      expect(result.success).to.be.true;
    });

    it('should validate old date', () => {
      const result = veteranDOBSchema.safeParse('1920-01-01');
      expect(result.success).to.be.true;
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      const result = veteranDOBSchema.safeParse(futureDateString);
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'cannot be in the future',
      );
    });

    it('should reject empty date', () => {
      const result = veteranDOBSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Date of birth is required',
      );
    });

    it('should reject invalid date string', () => {
      const result = veteranDOBSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Please enter a valid date',
      );
    });

    it('should reject invalid date format', () => {
      const result = veteranDOBSchema.safeParse('13/32/2020');
      expect(result.success).to.be.false;
    });
  });

  describe('veteranServiceNumberSchema', () => {
    it('should validate service number', () => {
      const result = veteranServiceNumberSchema.safeParse('SVC123456');
      expect(result.success).to.be.true;
    });

    it('should validate empty service number', () => {
      const result = veteranServiceNumberSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined service number', () => {
      const result = veteranServiceNumberSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should reject service number over 20 characters', () => {
      const result = veteranServiceNumberSchema.safeParse('A'.repeat(21));
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'must be less than 20 characters',
      );
    });

    it('should validate service number at max length', () => {
      const result = veteranServiceNumberSchema.safeParse('A'.repeat(20));
      expect(result.success).to.be.true;
    });
  });

  describe('isVeteranClaimantSchema', () => {
    it('should validate yes', () => {
      const result = isVeteranClaimantSchema.safeParse('yes');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('yes');
    });

    it('should validate no', () => {
      const result = isVeteranClaimantSchema.safeParse('no');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('no');
    });

    it('should reject invalid value', () => {
      const result = isVeteranClaimantSchema.safeParse('maybe');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'if you are the Veteran',
      );
    });

    it('should reject empty value', () => {
      const result = isVeteranClaimantSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject null value', () => {
      const result = isVeteranClaimantSchema.safeParse(null);
      expect(result.success).to.be.false;
    });
  });

  describe('fullNameSchema (used as veteranFullName)', () => {
    it('should validate complete name', () => {
      const data = {
        first: 'Boba',
        middle: 'Tiberius',
        last: 'Fett',
      };
      const result = fullNameSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate name without middle name', () => {
      const data = {
        first: 'Boba',
        middle: '',
        last: 'Fett',
      };
      const result = fullNameSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject missing first name', () => {
      const data = {
        first: '',
        middle: 'Middle',
        last: 'Last',
      };
      const result = fullNameSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing last name', () => {
      const data = {
        first: 'First',
        middle: 'Middle',
        last: '',
      };
      const result = fullNameSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });

  describe('veteranIdentificationSchema', () => {
    it('should validate complete veteran identification', () => {
      const data = {
        veteranFullName: {
          first: 'Boba',
          middle: 'Tiberius',
          last: 'Fett',
        },
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
        veteranFullName: {
          first: 'Boba',
          middle: '',
          last: 'Fett',
        },
        veteranSSN: '123456789',
        veteranFileNumber: '',
        veteranServiceNumber: '',
        veteranDOB: '1985-03-22',
        isVeteranClaimant: 'no',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject missing first name', () => {
      const data = {
        veteranFullName: {
          first: '',
          middle: '',
          last: 'Fett',
        },
        veteranSSN: '123456789',
        veteranFileNumber: '',
        veteranServiceNumber: '',
        veteranDOB: '1985-03-22',
        isVeteranClaimant: 'yes',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing last name', () => {
      const data = {
        veteranFullName: {
          first: 'Boba',
          middle: '',
          last: '',
        },
        veteranSSN: '123456789',
        veteranFileNumber: '',
        veteranServiceNumber: '',
        veteranDOB: '1985-03-22',
        isVeteranClaimant: 'yes',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing SSN', () => {
      const data = {
        veteranFullName: {
          first: 'Boba',
          middle: '',
          last: 'Fett',
        },
        veteranSSN: '',
        veteranFileNumber: '',
        veteranServiceNumber: '',
        veteranDOB: '1985-03-22',
        isVeteranClaimant: 'yes',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing DOB', () => {
      const data = {
        veteranFullName: {
          first: 'Boba',
          middle: '',
          last: 'Fett',
        },
        veteranSSN: '123456789',
        veteranFileNumber: '',
        veteranServiceNumber: '',
        veteranDOB: '',
        isVeteranClaimant: 'yes',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing claimant status', () => {
      const data = {
        veteranFullName: {
          first: 'Boba',
          middle: '',
          last: 'Fett',
        },
        veteranSSN: '123456789',
        veteranFileNumber: '',
        veteranServiceNumber: '',
        veteranDOB: '1985-03-22',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid SSN format', () => {
      const data = {
        veteranFullName: {
          first: 'Boba',
          middle: '',
          last: 'Fett',
        },
        veteranSSN: '12345',
        veteranFileNumber: '',
        veteranServiceNumber: '',
        veteranDOB: '1985-03-22',
        isVeteranClaimant: 'yes',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject future DOB', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const data = {
        veteranFullName: {
          first: 'Boba',
          middle: '',
          last: 'Fett',
        },
        veteranSSN: '123456789',
        veteranFileNumber: '',
        veteranServiceNumber: '',
        veteranDOB: futureDate.toISOString().split('T')[0],
        isVeteranClaimant: 'yes',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject multiple invalid fields and provide all errors', () => {
      const data = {
        veteranFullName: {
          first: '',
          middle: '',
          last: '',
        },
        veteranSSN: '123',
        veteranFileNumber: '123',
        veteranServiceNumber: 'A'.repeat(30),
        veteranDOB: 'invalid',
      };
      const result = veteranIdentificationSchema.safeParse(data);
      expect(result.success).to.be.false;
      expect(result.error.errors.length).to.be.greaterThan(1);
    });
  });
});
