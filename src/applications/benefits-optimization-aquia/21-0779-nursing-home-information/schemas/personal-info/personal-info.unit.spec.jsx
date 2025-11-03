import { expect } from 'chai';
import {
  ssnSchema,
  vaFileNumberSchema,
  dateOfBirthSchema,
  fullNameSchema,
  personalInfoSchema,
  firstNameSchema,
  lastNameSchema,
  middleNameSchema,
  suffixSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/personal-info/personal-info';

describe('Personal Info Schemas', () => {
  describe('firstNameSchema', () => {
    it('should validate valid first name', () => {
      const result = firstNameSchema.safeParse('John');
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

    it('should reject null first name', () => {
      const result = firstNameSchema.safeParse(null);
      expect(result.success).to.be.false;
    });
  });

  describe('lastNameSchema', () => {
    it('should validate valid last name', () => {
      const result = lastNameSchema.safeParse('Smith');
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

    it('should reject null last name', () => {
      const result = lastNameSchema.safeParse(null);
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
  });

  describe('suffixSchema', () => {
    it('should validate valid suffix', () => {
      const result = suffixSchema.safeParse('Jr');
      expect(result.success).to.be.true;
    });

    it('should validate empty suffix', () => {
      const result = suffixSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should validate undefined suffix', () => {
      const result = suffixSchema.safeParse(undefined);
      expect(result.success).to.be.true;
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

    it('should validate undefined SSN (optional)', () => {
      const result = ssnSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('should validate empty SSN (optional)', () => {
      const result = ssnSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should reject SSN with too few digits', () => {
      const result = ssnSchema.safeParse('12345');
      expect(result.success).to.be.false;
    });

    it('should reject SSN with too many digits', () => {
      const result = ssnSchema.safeParse('1234567890');
      expect(result.success).to.be.false;
    });

    it('should reject SSN with letters', () => {
      const result = ssnSchema.safeParse('12345678A');
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
    });

    it('should reject file number with too many digits', () => {
      const result = vaFileNumberSchema.safeParse('1234567890');
      expect(result.success).to.be.false;
    });

    it('should reject file number with letters', () => {
      const result = vaFileNumberSchema.safeParse('1234567A');
      expect(result.success).to.be.false;
    });
  });

  describe('dateOfBirthSchema', () => {
    it('should validate valid date', () => {
      const result = dateOfBirthSchema.safeParse('1985-03-22');
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

    it('should reject null date', () => {
      const result = dateOfBirthSchema.safeParse(null);
      expect(result.success).to.be.false;
    });
  });

  describe('fullNameSchema', () => {
    it('should validate complete name', () => {
      const validData = {
        first: 'John',
        middle: 'Michael',
        last: 'Smith',
        suffix: 'Jr',
      };
      const result = fullNameSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate name without middle name and suffix', () => {
      const validData = {
        first: 'John',
        last: 'Smith',
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
  });

  describe('personalInfoSchema', () => {
    it('should validate complete personal info', () => {
      const validData = {
        fullName: {
          first: 'John',
          middle: 'Michael',
          last: 'Smith',
          suffix: 'Jr',
        },
        dateOfBirth: '1985-03-22',
        ssn: '123-45-6789',
        vaFileNumber: '12345678',
      };
      const result = personalInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.ssn).to.equal('123456789');
      }
    });

    it('should validate without optional fields', () => {
      const validData = {
        fullName: {
          first: 'John',
          last: 'Smith',
        },
        dateOfBirth: '1985-03-22',
      };
      const result = personalInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing fullName', () => {
      const invalidData = {
        dateOfBirth: '1985-03-22',
        ssn: '123456789',
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing dateOfBirth', () => {
      const invalidData = {
        fullName: {
          first: 'John',
          last: 'Smith',
        },
        ssn: '123456789',
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid SSN', () => {
      const invalidData = {
        fullName: {
          first: 'John',
          last: 'Smith',
        },
        dateOfBirth: '1985-03-22',
        ssn: '123',
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid VA file number', () => {
      const invalidData = {
        fullName: {
          first: 'John',
          last: 'Smith',
        },
        dateOfBirth: '1985-03-22',
        vaFileNumber: '123',
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
