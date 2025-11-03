import { expect } from 'chai';
import {
  firstNameSchema,
  middleNameSchema,
  lastNameSchema,
  fullNameSchema,
  ssnSchema,
  vaFileNumberSchema,
  dateOfBirthSchema,
  veteranPersonalInfoSchema,
  veteranIdentificationInfoSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/veteran-identification/veteran-identification';

describe('Veteran Identification Schemas', () => {
  describe('firstNameSchema', () => {
    it('should validate valid first name', () => {
      const result = firstNameSchema.safeParse('John');
      expect(result.success).to.be.true;
    });

    it('should validate first name with hyphen', () => {
      const result = firstNameSchema.safeParse('Mary-Jane');
      expect(result.success).to.be.true;
    });

    it('should validate first name with apostrophe', () => {
      const result = firstNameSchema.safeParse("O'Brien");
      expect(result.success).to.be.true;
    });

    it('should validate first name with spaces', () => {
      const result = firstNameSchema.safeParse('Mary Jo');
      expect(result.success).to.be.true;
    });

    it('should validate first name at max length', () => {
      const result = firstNameSchema.safeParse('A'.repeat(30));
      expect(result.success).to.be.true;
    });

    it('should reject empty first name', () => {
      const result = firstNameSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'First name is required',
        );
      }
    });

    it('should reject first name over 30 characters', () => {
      const result = firstNameSchema.safeParse('A'.repeat(31));
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'must be less than 30 characters',
        );
      }
    });

    it('should reject first name with numbers', () => {
      const result = firstNameSchema.safeParse('John123');
      expect(result.success).to.be.false;
    });

    it('should reject first name with special characters', () => {
      const result = firstNameSchema.safeParse('John@Doe');
      expect(result.success).to.be.false;
    });

    it('should reject null first name', () => {
      const result = firstNameSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined first name', () => {
      const result = firstNameSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });
  });

  describe('middleNameSchema', () => {
    it('should validate valid middle name', () => {
      const result = middleNameSchema.safeParse('Michael');
      expect(result.success).to.be.true;
    });

    it('should validate empty middle name', () => {
      const result = middleNameSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined middle name', () => {
      const result = middleNameSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should validate middle name with hyphen', () => {
      const result = middleNameSchema.safeParse('Ann-Marie');
      expect(result.success).to.be.true;
    });

    it('should validate middle name at max length', () => {
      const result = middleNameSchema.safeParse('M'.repeat(30));
      expect(result.success).to.be.true;
    });

    it('should reject middle name over 30 characters', () => {
      const result = middleNameSchema.safeParse('M'.repeat(31));
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'must be less than 30 characters',
        );
      }
    });

    it('should reject middle name with numbers', () => {
      const result = middleNameSchema.safeParse('Middle123');
      expect(result.success).to.be.false;
    });

    it('should reject middle name with special characters', () => {
      const result = middleNameSchema.safeParse('Middle@');
      expect(result.success).to.be.false;
    });
  });

  describe('lastNameSchema', () => {
    it('should validate valid last name', () => {
      const result = lastNameSchema.safeParse('Smith');
      expect(result.success).to.be.true;
    });

    it('should validate last name with hyphen', () => {
      const result = lastNameSchema.safeParse('Smith-Jones');
      expect(result.success).to.be.true;
    });

    it('should validate last name with apostrophe', () => {
      const result = lastNameSchema.safeParse("O'Connor");
      expect(result.success).to.be.true;
    });

    it('should validate last name with spaces', () => {
      const result = lastNameSchema.safeParse('Van Der Berg');
      expect(result.success).to.be.true;
    });

    it('should validate last name at max length', () => {
      const result = lastNameSchema.safeParse('L'.repeat(30));
      expect(result.success).to.be.true;
    });

    it('should reject empty last name', () => {
      const result = lastNameSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Last name is required',
        );
      }
    });

    it('should reject last name over 30 characters', () => {
      const result = lastNameSchema.safeParse('L'.repeat(31));
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'must be less than 30 characters',
        );
      }
    });

    it('should reject last name with numbers', () => {
      const result = lastNameSchema.safeParse('Smith123');
      expect(result.success).to.be.false;
    });

    it('should reject last name with special characters', () => {
      const result = lastNameSchema.safeParse('Smith@');
      expect(result.success).to.be.false;
    });

    it('should reject null last name', () => {
      const result = lastNameSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined last name', () => {
      const result = lastNameSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });
  });

  describe('fullNameSchema', () => {
    it('should validate complete name with all fields', () => {
      const validData = {
        first: 'John',
        middle: 'Michael',
        last: 'Smith',
      };
      const result = fullNameSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate name without middle name', () => {
      const validData = {
        first: 'John',
        middle: '',
        last: 'Smith',
      };
      const result = fullNameSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate name with hyphenated first name', () => {
      const validData = {
        first: 'Mary-Jane',
        middle: 'Ann',
        last: 'Watson',
      };
      const result = fullNameSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing first name', () => {
      const invalidData = {
        first: '',
        middle: 'Middle',
        last: 'Last',
      };
      const result = fullNameSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing last name', () => {
      const invalidData = {
        first: 'First',
        middle: 'Middle',
        last: '',
      };
      const result = fullNameSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid first name', () => {
      const invalidData = {
        first: 'John123',
        middle: 'Middle',
        last: 'Smith',
      };
      const result = fullNameSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty object', () => {
      const invalidData = {};
      const result = fullNameSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });

  describe('ssnSchema', () => {
    it('should validate valid SSN', () => {
      const result = ssnSchema.safeParse('123456789');
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data).to.equal('123456789');
      }
    });

    it('should validate SSN with dashes and strip them', () => {
      const result = ssnSchema.safeParse('123-45-6789');
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data).to.equal('123456789');
      }
    });

    it('should reject SSN with too few digits', () => {
      const result = ssnSchema.safeParse('12345');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal('SSN must be 9 digits');
      }
    });

    it('should reject SSN with too many digits', () => {
      const result = ssnSchema.safeParse('1234567890');
      expect(result.success).to.be.false;
    });

    it('should reject SSN with letters', () => {
      const result = ssnSchema.safeParse('12345678A');
      expect(result.success).to.be.false;
    });

    it('should reject empty SSN', () => {
      const result = ssnSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Social Security Number is required',
        );
      }
    });

    it('should reject null SSN', () => {
      const result = ssnSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined SSN', () => {
      const result = ssnSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should validate SSN with only dashes', () => {
      const result = ssnSchema.safeParse('---');
      expect(result.success).to.be.false;
    });
  });

  describe('vaFileNumberSchema', () => {
    it('should validate 8 digit file number', () => {
      const result = vaFileNumberSchema.safeParse('12345678');
      expect(result.success).to.be.true;
    });

    it('should validate 9 digit file number', () => {
      const result = vaFileNumberSchema.safeParse('123456789');
      expect(result.success).to.be.true;
    });

    it('should validate empty file number', () => {
      const result = vaFileNumberSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined file number', () => {
      const result = vaFileNumberSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should reject file number with too few digits', () => {
      const result = vaFileNumberSchema.safeParse('123');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'must be 8 or 9 digits',
        );
      }
    });

    it('should reject file number with too many digits', () => {
      const result = vaFileNumberSchema.safeParse('1234567890');
      expect(result.success).to.be.false;
    });

    it('should reject file number with letters', () => {
      const result = vaFileNumberSchema.safeParse('1234567A');
      expect(result.success).to.be.false;
    });

    it('should reject file number with 7 digits', () => {
      const result = vaFileNumberSchema.safeParse('1234567');
      expect(result.success).to.be.false;
    });

    it('should reject file number with 10 digits', () => {
      const result = vaFileNumberSchema.safeParse('1234567890');
      expect(result.success).to.be.false;
    });
  });

  describe('dateOfBirthSchema', () => {
    it('should validate valid date', () => {
      const result = dateOfBirthSchema.safeParse('1985-03-22');
      expect(result.success).to.be.true;
    });

    it('should validate old date', () => {
      const result = dateOfBirthSchema.safeParse('1920-01-01');
      expect(result.success).to.be.true;
    });

    it('should validate date in YYYY-MM-DD format', () => {
      const result = dateOfBirthSchema.safeParse('2000-12-31');
      expect(result.success).to.be.true;
    });

    it('should reject empty date', () => {
      const result = dateOfBirthSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Date of birth is required',
        );
      }
    });

    it('should reject invalid date string', () => {
      const result = dateOfBirthSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Please enter a valid date',
        );
      }
    });

    it('should reject invalid date format', () => {
      const result = dateOfBirthSchema.safeParse('13/32/2020');
      expect(result.success).to.be.false;
    });

    it('should reject null date', () => {
      const result = dateOfBirthSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined date', () => {
      const result = dateOfBirthSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should reject date with wrong month', () => {
      const result = dateOfBirthSchema.safeParse('1985-13-01');
      expect(result.success).to.be.false;
    });

    it('should reject date with wrong day', () => {
      const result = dateOfBirthSchema.safeParse('1985-01-32');
      expect(result.success).to.be.false;
    });
  });

  describe('veteranPersonalInfoSchema', () => {
    it('should validate complete veteran personal info', () => {
      const validData = {
        fullName: {
          first: 'John',
          middle: 'Michael',
          last: 'Smith',
        },
        dateOfBirth: '1985-03-22',
      };
      const result = veteranPersonalInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate veteran personal info without middle name', () => {
      const validData = {
        fullName: {
          first: 'John',
          middle: '',
          last: 'Smith',
        },
        dateOfBirth: '1950-06-15',
      };
      const result = veteranPersonalInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing fullName', () => {
      const invalidData = {
        dateOfBirth: '1985-03-22',
      };
      const result = veteranPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing dateOfBirth', () => {
      const invalidData = {
        fullName: {
          first: 'John',
          middle: 'Michael',
          last: 'Smith',
        },
      };
      const result = veteranPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid first name', () => {
      const invalidData = {
        fullName: {
          first: '',
          middle: 'Michael',
          last: 'Smith',
        },
        dateOfBirth: '1985-03-22',
      };
      const result = veteranPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid date', () => {
      const invalidData = {
        fullName: {
          first: 'John',
          middle: 'Michael',
          last: 'Smith',
        },
        dateOfBirth: 'invalid',
      };
      const result = veteranPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty object', () => {
      const invalidData = {};
      const result = veteranPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });

  describe('veteranIdentificationInfoSchema', () => {
    it('should validate complete veteran identification info', () => {
      const validData = {
        ssn: '123-45-6789',
        vaFileNumber: '12345678',
      };
      const result = veteranIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.ssn).to.equal('123456789');
      }
    });

    it('should validate veteran identification info without VA file number', () => {
      const validData = {
        ssn: '123456789',
        vaFileNumber: '',
      };
      const result = veteranIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with 9-digit VA file number', () => {
      const validData = {
        ssn: '123-45-6789',
        vaFileNumber: '123456789',
      };
      const result = veteranIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing ssn', () => {
      const invalidData = {
        vaFileNumber: '12345678',
      };
      const result = veteranIdentificationInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty ssn', () => {
      const invalidData = {
        ssn: '',
        vaFileNumber: '12345678',
      };
      const result = veteranIdentificationInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid ssn format', () => {
      const invalidData = {
        ssn: '123',
        vaFileNumber: '12345678',
      };
      const result = veteranIdentificationInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid VA file number format', () => {
      const invalidData = {
        ssn: '123-45-6789',
        vaFileNumber: '123',
      };
      const result = veteranIdentificationInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty object', () => {
      const invalidData = {};
      const result = veteranIdentificationInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject with multiple invalid fields', () => {
      const invalidData = {
        ssn: '123',
        vaFileNumber: 'ABC',
      };
      const result = veteranIdentificationInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues.length).to.be.greaterThan(0);
      }
    });
  });
});
