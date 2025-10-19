/**
 * Unit tests for veteran identification schemas
 */

import { expect } from 'chai';
import {
  dateOfBirthSchema,
  dateOfDeathSchema,
  firstNameSchema,
  fullNameSchema,
  lastNameSchema,
  middleNameSchema,
  placeOfBirthSchema,
  serviceNumberSchema,
  ssnSchema,
  vaFileNumberSchema,
  veteranIdentificationSchema,
} from './veteran-identification';

describe('Veteran Identification Schemas', () => {
  describe('firstNameSchema', () => {
    it('should validate a valid first name', () => {
      const result = firstNameSchema.safeParse('John');
      expect(result.success).to.be.true;
    });

    it('should require first name', () => {
      const result = firstNameSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should accept names with hyphens and apostrophes', () => {
      const result = firstNameSchema.safeParse("Mary-Jane O'Brien");
      expect(result.success).to.be.true;
    });

    it('should reject names over 30 characters', () => {
      const longName = 'a'.repeat(31);
      const result = firstNameSchema.safeParse(longName);
      expect(result.success).to.be.false;
    });
  });

  describe('middleNameSchema', () => {
    it('should validate a valid middle name', () => {
      const result = middleNameSchema.safeParse('Michael');
      expect(result.success).to.be.true;
    });

    it('should allow empty string', () => {
      const result = middleNameSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should allow undefined', () => {
      const result = middleNameSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });
  });

  describe('lastNameSchema', () => {
    it('should validate a valid last name', () => {
      const result = lastNameSchema.safeParse('Smith');
      expect(result.success).to.be.true;
    });

    it('should require last name', () => {
      const result = lastNameSchema.safeParse('');
      expect(result.success).to.be.false;
    });
  });

  describe('fullNameSchema', () => {
    it('should validate a complete name', () => {
      const validName = {
        first: 'John',
        middle: 'Michael',
        last: 'Smith',
      };
      const result = fullNameSchema.safeParse(validName);
      expect(result.success).to.be.true;
    });

    it('should validate name without middle name', () => {
      const validName = {
        first: 'John',
        middle: '',
        last: 'Smith',
      };
      const result = fullNameSchema.safeParse(validName);
      expect(result.success).to.be.true;
    });
  });

  describe('ssnSchema', () => {
    it('should validate a valid SSN with dashes', () => {
      const result = ssnSchema.safeParse('123-45-6789');
      expect(result.success).to.be.true;
    });

    it('should validate a valid SSN without dashes', () => {
      const result = ssnSchema.safeParse('123456789');
      expect(result.success).to.be.true;
    });

    it('should require SSN', () => {
      const result = ssnSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject invalid SSN format', () => {
      const result = ssnSchema.safeParse('12-34-5678');
      expect(result.success).to.be.false;
    });
  });

  describe('serviceNumberSchema', () => {
    it('should validate a valid service number', () => {
      const result = serviceNumberSchema.safeParse('ABC1234567');
      expect(result.success).to.be.true;
    });

    it('should allow empty string', () => {
      const result = serviceNumberSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should reject invalid format', () => {
      const result = serviceNumberSchema.safeParse('12345');
      expect(result.success).to.be.false;
    });
  });

  describe('vaFileNumberSchema', () => {
    it('should validate 8-digit file number', () => {
      const result = vaFileNumberSchema.safeParse('12345678');
      expect(result.success).to.be.true;
    });

    it('should validate 9-digit file number', () => {
      const result = vaFileNumberSchema.safeParse('123456789');
      expect(result.success).to.be.true;
    });

    it('should allow empty string', () => {
      const result = vaFileNumberSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should reject invalid format', () => {
      const result = vaFileNumberSchema.safeParse('1234567');
      expect(result.success).to.be.false;
    });
  });

  describe('dateOfBirthSchema', () => {
    it('should validate a valid date', () => {
      const result = dateOfBirthSchema.safeParse('1980-05-15');
      expect(result.success).to.be.true;
    });

    it('should require date', () => {
      const result = dateOfBirthSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject invalid date', () => {
      const result = dateOfBirthSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
    });
  });

  describe('placeOfBirthSchema', () => {
    it('should validate a valid place of birth', () => {
      const validPlace = {
        city: 'Arlington',
        state: 'VA',
      };
      const result = placeOfBirthSchema.safeParse(validPlace);
      expect(result.success).to.be.true;
    });

    it('should require city', () => {
      const invalidPlace = {
        city: '',
        state: 'VA',
      };
      const result = placeOfBirthSchema.safeParse(invalidPlace);
      expect(result.success).to.be.false;
    });

    it('should require state', () => {
      const invalidPlace = {
        city: 'Arlington',
        state: '',
      };
      const result = placeOfBirthSchema.safeParse(invalidPlace);
      expect(result.success).to.be.false;
    });
  });

  describe('dateOfDeathSchema', () => {
    it('should validate a valid past date', () => {
      const result = dateOfDeathSchema.safeParse('2023-01-15');
      expect(result.success).to.be.true;
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = dateOfDeathSchema.safeParse(
        futureDate.toISOString().split('T')[0],
      );
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('future');
      }
    });

    it('should require date', () => {
      const result = dateOfDeathSchema.safeParse('');
      expect(result.success).to.be.false;
    });
  });

  describe('veteranIdentificationSchema', () => {
    it('should validate complete veteran identification', () => {
      const validData = {
        fullName: {
          first: 'John',
          middle: 'M',
          last: 'Smith',
        },
        ssn: '123-45-6789',
        serviceNumber: 'ABC123456',
        vaFileNumber: '12345678',
        dateOfBirth: '1950-05-15',
        placeOfBirth: {
          city: 'Arlington',
          state: 'VA',
        },
        dateOfDeath: '2023-01-15',
      };
      const result = veteranIdentificationSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject when death date is before birth date', () => {
      const invalidData = {
        fullName: {
          first: 'John',
          middle: 'M',
          last: 'Smith',
        },
        ssn: '123-45-6789',
        serviceNumber: '',
        vaFileNumber: '',
        dateOfBirth: '2023-05-15',
        placeOfBirth: {
          city: 'Arlington',
          state: 'VA',
        },
        dateOfDeath: '2020-01-15',
      };
      const result = veteranIdentificationSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'after date of birth',
        );
      }
    });
  });
});
