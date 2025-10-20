/**
 * @module tests/schemas/veteran-identification.unit.spec
 * @description Unit tests for veteran identification validation schemas
 */

import { expect } from 'chai';
import {
  veteranFirstNameSchema,
  veteranMiddleNameSchema,
  veteranLastNameSchema,
  veteranFullNameSchema,
  veteranSSNSchema,
  veteranFileNumberSchema,
  veteranServiceNumberSchema,
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

    it('should validate first name with hyphen', () => {
      const result = veteranFirstNameSchema.safeParse('Jean-Luc');
      expect(result.success).to.be.true;
    });

    it('should validate first name with apostrophe', () => {
      const result = veteranFirstNameSchema.safeParse("O'Brien");
      expect(result.success).to.be.true;
    });

    it('should validate first name with space', () => {
      const result = veteranFirstNameSchema.safeParse('Mary Jane');
      expect(result.success).to.be.true;
    });

    it('should reject empty first name', () => {
      const result = veteranFirstNameSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('First name is required');
    });

    it('should reject first name over 30 characters', () => {
      const result = veteranFirstNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'must be less than 30 characters',
      );
    });

    it('should reject first name with numbers', () => {
      const result = veteranFirstNameSchema.safeParse('John123');
      expect(result.success).to.be.false;
    });

    it('should reject first name with special characters', () => {
      const result = veteranFirstNameSchema.safeParse('John@Doe');
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

    it('should validate undefined middle name', () => {
      const result = veteranMiddleNameSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should validate middle name with hyphen', () => {
      const result = veteranMiddleNameSchema.safeParse('Anne-Marie');
      expect(result.success).to.be.true;
    });

    it('should reject middle name over 30 characters', () => {
      const result = veteranMiddleNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });

    it('should reject middle name with numbers', () => {
      const result = veteranMiddleNameSchema.safeParse('Middle123');
      expect(result.success).to.be.false;
    });
  });

  describe('veteranLastNameSchema', () => {
    it('should validate valid last name', () => {
      const result = veteranLastNameSchema.safeParse('Fett');
      expect(result.success).to.be.true;
    });

    it('should validate last name with hyphen', () => {
      const result = veteranLastNameSchema.safeParse('Smith-Jones');
      expect(result.success).to.be.true;
    });

    it('should validate last name with apostrophe', () => {
      const result = veteranLastNameSchema.safeParse("O'Connor");
      expect(result.success).to.be.true;
    });

    it('should reject empty last name', () => {
      const result = veteranLastNameSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('Last name is required');
    });

    it('should reject last name over 30 characters', () => {
      const result = veteranLastNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
    });

    it('should reject last name with numbers', () => {
      const result = veteranLastNameSchema.safeParse('Smith123');
      expect(result.success).to.be.false;
    });
  });

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

  describe('veteranFullNameSchema', () => {
    it('should validate complete name', () => {
      const data = {
        first: 'Boba',
        middle: 'Tiberius',
        last: 'Fett',
      };
      const result = veteranFullNameSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate name without middle name', () => {
      const data = {
        first: 'Boba',
        middle: '',
        last: 'Fett',
      };
      const result = veteranFullNameSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject missing first name', () => {
      const data = {
        first: '',
        middle: 'Middle',
        last: 'Last',
      };
      const result = veteranFullNameSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing last name', () => {
      const data = {
        first: 'First',
        middle: 'Middle',
        last: '',
      };
      const result = veteranFullNameSchema.safeParse(data);
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

    it('should reject missing first name', () => {
      const data = {
        veteranFirstName: '',
        veteranMiddleName: '',
        veteranLastName: 'Fett',
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
        veteranFirstName: 'Boba',
        veteranMiddleName: '',
        veteranLastName: '',
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
        veteranFirstName: 'Boba',
        veteranMiddleName: '',
        veteranLastName: 'Fett',
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
        veteranFirstName: 'Boba',
        veteranMiddleName: '',
        veteranLastName: 'Fett',
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
        veteranFirstName: 'Boba',
        veteranMiddleName: '',
        veteranLastName: 'Fett',
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
        veteranFirstName: 'Boba',
        veteranMiddleName: '',
        veteranLastName: 'Fett',
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
        veteranFirstName: 'Boba',
        veteranMiddleName: '',
        veteranLastName: 'Fett',
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
        veteranFirstName: '',
        veteranMiddleName: '',
        veteranLastName: '',
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
