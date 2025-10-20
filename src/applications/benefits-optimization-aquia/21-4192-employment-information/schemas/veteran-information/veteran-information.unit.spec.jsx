/**
 * @module tests/schemas/veteran-information.unit.spec
 * @description Unit tests for veteran information validation schemas
 */

import { expect } from 'chai';
import {
  dateOfBirthSchema,
  firstNameSchema,
  fullNameSchema,
  lastNameSchema,
  middleNameSchema,
  ssnSchema,
  vaFileNumberSchema,
  veteranInformationSchema,
} from './veteran-information';

describe('Veteran Information Schemas', () => {
  describe('firstNameSchema', () => {
    describe('Valid Names', () => {
      it('should validate basic first name', () => {
        const result = firstNameSchema.safeParse('James');
        expect(result.success).to.be.true;
      });

      it('should validate hyphenated first name', () => {
        const result = firstNameSchema.safeParse('Jean-Luc');
        expect(result.success).to.be.true;
      });

      it('should validate name with apostrophe', () => {
        const result = firstNameSchema.safeParse("O'Brien");
        expect(result.success).to.be.true;
      });

      it('should validate name with spaces', () => {
        const result = firstNameSchema.safeParse('Mary Jane');
        expect(result.success).to.be.true;
      });

      it('should validate single letter name', () => {
        const result = firstNameSchema.safeParse('T');
        expect(result.success).to.be.true;
      });

      it('should validate 30 character name', () => {
        const result = firstNameSchema.safeParse('A'.repeat(30));
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Names', () => {
      it('should reject empty string', () => {
        const result = firstNameSchema.safeParse('');
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include('required');
        }
      });

      it('should reject names over 30 characters', () => {
        const result = firstNameSchema.safeParse('A'.repeat(31));
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include(
            'less than 30 characters',
          );
        }
      });

      it('should reject names with numbers', () => {
        const result = firstNameSchema.safeParse('James123');
        expect(result.success).to.be.false;
      });

      it('should reject names with special characters', () => {
        const result = firstNameSchema.safeParse('James@Kirk');
        expect(result.success).to.be.false;
      });
    });
  });

  describe('middleNameSchema', () => {
    describe('Valid Middle Names', () => {
      it('should validate basic middle name', () => {
        const result = middleNameSchema.safeParse('Tiberius');
        expect(result.success).to.be.true;
      });

      it('should validate empty string', () => {
        const result = middleNameSchema.safeParse('');
        expect(result.success).to.be.true;
      });

      it('should validate undefined', () => {
        const result = middleNameSchema.safeParse(undefined);
        expect(result.success).to.be.true;
      });

      it('should validate hyphenated middle name', () => {
        const result = middleNameSchema.safeParse('Anne-Marie');
        expect(result.success).to.be.true;
      });

      it('should validate middle initial', () => {
        const result = middleNameSchema.safeParse('T');
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Middle Names', () => {
      it('should reject names over 30 characters', () => {
        const result = middleNameSchema.safeParse('A'.repeat(31));
        expect(result.success).to.be.false;
      });

      it('should reject names with numbers', () => {
        const result = middleNameSchema.safeParse('Tiberius3');
        expect(result.success).to.be.false;
      });
    });
  });

  describe('lastNameSchema', () => {
    describe('Valid Last Names', () => {
      it('should validate basic last name', () => {
        const result = lastNameSchema.safeParse('Kirk');
        expect(result.success).to.be.true;
      });

      it('should validate hyphenated last name', () => {
        const result = lastNameSchema.safeParse('Crusher-Picard');
        expect(result.success).to.be.true;
      });

      it('should validate name with apostrophe', () => {
        const result = lastNameSchema.safeParse("O'Brien");
        expect(result.success).to.be.true;
      });

      it('should validate name with spaces', () => {
        const result = lastNameSchema.safeParse('Van Buren');
        expect(result.success).to.be.true;
      });

      it('should validate single letter name', () => {
        const result = lastNameSchema.safeParse('Q');
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Last Names', () => {
      it('should reject empty string', () => {
        const result = lastNameSchema.safeParse('');
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include('required');
        }
      });

      it('should reject names over 30 characters', () => {
        const result = lastNameSchema.safeParse('A'.repeat(31));
        expect(result.success).to.be.false;
      });

      it('should reject names with numbers', () => {
        const result = lastNameSchema.safeParse('Kirk123');
        expect(result.success).to.be.false;
      });
    });
  });

  describe('fullNameSchema', () => {
    describe('Valid Full Names', () => {
      it('should validate complete name with all fields', () => {
        const result = fullNameSchema.safeParse({
          first: 'James',
          middle: 'Tiberius',
          last: 'Kirk',
        });
        expect(result.success).to.be.true;
      });

      it('should validate name without middle name', () => {
        const result = fullNameSchema.safeParse({
          first: 'Spock',
          middle: '',
          last: 'Vulcan',
        });
        expect(result.success).to.be.true;
      });

      it('should validate name with undefined middle name', () => {
        const result = fullNameSchema.safeParse({
          first: 'Worf',
          last: 'Mogh',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Star Trek characters', () => {
        const characters = [
          { first: 'Jean-Luc', last: 'Picard' },
          { first: 'Benjamin', middle: 'Lafayette', last: 'Sisko' },
          { first: 'Kathryn', last: 'Janeway' },
          { first: 'Miles', middle: "O'Brien", last: 'Chief' },
        ];

        characters.forEach(name => {
          const result = fullNameSchema.safeParse(name);
          expect(result.success).to.be.true;
        });
      });
    });

    describe('Invalid Full Names', () => {
      it('should reject missing first name', () => {
        const result = fullNameSchema.safeParse({
          middle: 'Tiberius',
          last: 'Kirk',
        });
        expect(result.success).to.be.false;
      });

      it('should reject empty first name', () => {
        const result = fullNameSchema.safeParse({
          first: '',
          last: 'Kirk',
        });
        expect(result.success).to.be.false;
      });

      it('should reject missing last name', () => {
        const result = fullNameSchema.safeParse({
          first: 'James',
          middle: 'Tiberius',
        });
        expect(result.success).to.be.false;
      });

      it('should reject empty last name', () => {
        const result = fullNameSchema.safeParse({
          first: 'James',
          last: '',
        });
        expect(result.success).to.be.false;
      });

      it('should reject invalid first name with numbers', () => {
        const result = fullNameSchema.safeParse({
          first: 'James123',
          last: 'Kirk',
        });
        expect(result.success).to.be.false;
      });
    });
  });

  describe('ssnSchema', () => {
    describe('Valid SSNs', () => {
      it('should validate SSN with dashes', () => {
        const result = ssnSchema.safeParse('123-45-6789');
        expect(result.success).to.be.true;
      });

      it('should validate SSN without dashes', () => {
        const result = ssnSchema.safeParse('123456789');
        expect(result.success).to.be.true;
      });

      it('should transform SSN with dashes to without dashes', () => {
        const result = ssnSchema.safeParse('123-45-6789');
        if (result.success) {
          expect(result.data).to.equal('123456789');
        }
      });

      it('should validate various Star Trek SSNs', () => {
        const ssns = [
          '111-22-3333',
          '222-33-4444',
          '555-66-7777',
          '999-88-7777',
        ];

        ssns.forEach(ssn => {
          const result = ssnSchema.safeParse(ssn);
          expect(result.success).to.be.true;
        });
      });
    });

    describe('Invalid SSNs', () => {
      it('should reject empty string', () => {
        const result = ssnSchema.safeParse('');
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include('required');
        }
      });

      it('should reject SSN with too few digits', () => {
        const result = ssnSchema.safeParse('12-34-567');
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include('9 digits');
        }
      });

      it('should reject SSN with too many digits', () => {
        const result = ssnSchema.safeParse('123-45-67890');
        expect(result.success).to.be.false;
      });

      it('should reject SSN with letters', () => {
        const result = ssnSchema.safeParse('123-45-678A');
        expect(result.success).to.be.false;
      });

      it('should reject SSN with special characters', () => {
        const result = ssnSchema.safeParse('123@45#6789');
        expect(result.success).to.be.false;
      });

      it('should reject undefined', () => {
        const result = ssnSchema.safeParse(undefined);
        expect(result.success).to.be.false;
      });

      it('should reject null', () => {
        const result = ssnSchema.safeParse(null);
        expect(result.success).to.be.false;
      });
    });
  });

  describe('vaFileNumberSchema', () => {
    describe('Valid VA File Numbers', () => {
      it('should validate 8-digit VA file number', () => {
        const result = vaFileNumberSchema.safeParse('12345678');
        expect(result.success).to.be.true;
      });

      it('should validate 9-digit VA file number', () => {
        const result = vaFileNumberSchema.safeParse('123456789');
        expect(result.success).to.be.true;
      });

      it('should validate empty string (optional)', () => {
        const result = vaFileNumberSchema.safeParse('');
        expect(result.success).to.be.true;
      });

      it('should validate undefined (optional)', () => {
        const result = vaFileNumberSchema.safeParse(undefined);
        expect(result.success).to.be.true;
      });

      it('should validate various valid lengths', () => {
        const validNumbers = ['87654321', '123456789'];

        validNumbers.forEach(num => {
          const result = vaFileNumberSchema.safeParse(num);
          expect(result.success).to.be.true;
        });
      });
    });

    describe('Invalid VA File Numbers', () => {
      it('should reject 7-digit number', () => {
        const result = vaFileNumberSchema.safeParse('1234567');
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include('8 or 9 digits');
        }
      });

      it('should reject 10-digit number', () => {
        const result = vaFileNumberSchema.safeParse('1234567890');
        expect(result.success).to.be.false;
      });

      it('should reject alphanumeric value', () => {
        const result = vaFileNumberSchema.safeParse('1234567A');
        expect(result.success).to.be.false;
      });

      it('should reject number with dashes', () => {
        const result = vaFileNumberSchema.safeParse('123-456-78');
        expect(result.success).to.be.false;
      });

      it('should reject number with spaces', () => {
        const result = vaFileNumberSchema.safeParse('123 456 789');
        expect(result.success).to.be.false;
      });
    });
  });

  describe('dateOfBirthSchema', () => {
    describe('Valid Dates', () => {
      it('should validate Star Trek date', () => {
        const result = dateOfBirthSchema.safeParse('2233-03-22');
        expect(result.success).to.be.true;
      });

      it('should validate past dates', () => {
        const result = dateOfBirthSchema.safeParse('1950-01-01');
        expect(result.success).to.be.true;
      });

      it('should validate today', () => {
        const today = new Date().toISOString().split('T')[0];
        const result = dateOfBirthSchema.safeParse(today);
        expect(result.success).to.be.true;
      });

      it('should validate various Star Trek character birthdates', () => {
        const dates = [
          '2230-01-06', // Spock
          '2227-01-20', // McCoy
          '2305-07-13', // Picard
          '2332-05-02', // Sisko
          '2336-05-20', // Janeway
        ];

        dates.forEach(date => {
          const result = dateOfBirthSchema.safeParse(date);
          expect(result.success).to.be.true;
        });
      });
    });

    describe('Invalid Dates', () => {
      it('should reject empty string', () => {
        const result = dateOfBirthSchema.safeParse('');
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include('required');
        }
      });

      it('should reject invalid date string', () => {
        const result = dateOfBirthSchema.safeParse('not-a-date');
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include('valid date');
        }
      });

      it('should reject invalid date format', () => {
        const result = dateOfBirthSchema.safeParse('13/32/2000');
        expect(result.success).to.be.false;
      });

      it('should reject undefined', () => {
        const result = dateOfBirthSchema.safeParse(undefined);
        expect(result.success).to.be.false;
      });

      it('should reject null', () => {
        const result = dateOfBirthSchema.safeParse(null);
        expect(result.success).to.be.false;
      });
    });
  });

  describe('veteranInformationSchema', () => {
    describe('Complete Veteran Information', () => {
      it('should validate complete veteran information', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: {
            first: 'James',
            middle: 'Tiberius',
            last: 'Kirk',
          },
          dateOfBirth: '2233-03-22',
          ssn: '123-45-6789',
          vaFileNumber: '12345678',
        });
        expect(result.success).to.be.true;
      });

      it('should validate veteran without middle name', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: {
            first: 'Spock',
            last: 'Vulcan',
          },
          dateOfBirth: '2230-01-06',
          ssn: '987-65-4321',
          vaFileNumber: '87654321',
        });
        expect(result.success).to.be.true;
      });

      it('should validate veteran without VA file number', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: {
            first: 'Leonard',
            middle: 'Horatio',
            last: 'McCoy',
          },
          dateOfBirth: '2227-01-20',
          ssn: '111-22-3333',
          vaFileNumber: '',
        });
        expect(result.success).to.be.true;
      });

      it('should validate veteran with undefined VA file number', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: {
            first: 'Nyota',
            last: 'Uhura',
          },
          dateOfBirth: '2239-01-19',
          ssn: '222-33-4444',
        });
        expect(result.success).to.be.true;
      });
    });

    describe('Multiple Star Trek Veterans', () => {
      it('should validate Jean-Luc Picard', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'Jean-Luc', last: 'Picard' },
          dateOfBirth: '2305-07-13',
          ssn: '555-66-7777',
          vaFileNumber: '13071305',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Benjamin Sisko', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'Benjamin', middle: 'Lafayette', last: 'Sisko' },
          dateOfBirth: '2332-05-02',
          ssn: '333-44-5555',
          vaFileNumber: '02053332',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Kathryn Janeway', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'Kathryn', last: 'Janeway' },
          dateOfBirth: '2336-05-20',
          ssn: '444-55-6666',
        });
        expect(result.success).to.be.true;
      });

      it("should validate Miles O'Brien", () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'Miles', middle: 'Edward', last: "O'Brien" },
          dateOfBirth: '2328-09-01',
          ssn: '666-77-8888',
          vaFileNumber: '01092328',
        });
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Veteran Information', () => {
      it('should reject missing fullName', () => {
        const result = veteranInformationSchema.safeParse({
          dateOfBirth: '2233-03-22',
          ssn: '123-45-6789',
        });
        expect(result.success).to.be.false;
      });

      it('should reject missing dateOfBirth', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'James', last: 'Kirk' },
          ssn: '123-45-6789',
        });
        expect(result.success).to.be.false;
      });

      it('should reject missing ssn', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'James', last: 'Kirk' },
          dateOfBirth: '2233-03-22',
        });
        expect(result.success).to.be.false;
      });

      it('should reject invalid SSN format', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'James', last: 'Kirk' },
          dateOfBirth: '2233-03-22',
          ssn: '123-45-678', // Too short
        });
        expect(result.success).to.be.false;
      });

      it('should reject invalid VA file number format', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'James', last: 'Kirk' },
          dateOfBirth: '2233-03-22',
          ssn: '123-45-6789',
          vaFileNumber: '123', // Too short
        });
        expect(result.success).to.be.false;
      });

      it('should reject invalid first name', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'James123', last: 'Kirk' },
          dateOfBirth: '2233-03-22',
          ssn: '123-45-6789',
        });
        expect(result.success).to.be.false;
      });
    });

    describe('Data Transformation', () => {
      it('should transform SSN by removing dashes', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'James', last: 'Kirk' },
          dateOfBirth: '2233-03-22',
          ssn: '123-45-6789',
          vaFileNumber: '12345678',
        });
        if (result.success) {
          expect(result.data.ssn).to.equal('123456789');
        }
      });

      it('should preserve SSN without dashes', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'James', last: 'Kirk' },
          dateOfBirth: '2233-03-22',
          ssn: '123456789',
          vaFileNumber: '12345678',
        });
        if (result.success) {
          expect(result.data.ssn).to.equal('123456789');
        }
      });
    });

    describe('Edge Cases', () => {
      it('should handle minimum valid data', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: { first: 'J', last: 'K' },
          dateOfBirth: '2000-01-01',
          ssn: '123456789',
        });
        expect(result.success).to.be.true;
      });

      it('should handle maximum length names', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: {
            first: 'A'.repeat(30),
            middle: 'B'.repeat(30),
            last: 'C'.repeat(30),
          },
          dateOfBirth: '2000-01-01',
          ssn: '123456789',
          vaFileNumber: '123456789',
        });
        expect(result.success).to.be.true;
      });

      it('should handle hyphenated and apostrophe names', () => {
        const result = veteranInformationSchema.safeParse({
          fullName: {
            first: 'Jean-Pierre',
            middle: "O'Malley-Smith",
            last: "D'Arcy-Johnson",
          },
          dateOfBirth: '2300-01-01',
          ssn: '123456789',
        });
        expect(result.success).to.be.true;
      });

      it('should reject empty object', () => {
        const result = veteranInformationSchema.safeParse({});
        expect(result.success).to.be.false;
      });
    });
  });
});
