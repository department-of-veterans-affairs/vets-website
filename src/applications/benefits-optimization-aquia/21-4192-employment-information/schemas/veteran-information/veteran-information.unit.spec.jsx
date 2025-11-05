/**
 * @module tests/schemas/veteran-information.unit.spec
 * @description Unit tests for veteran information validation schemas
 */

import { expect } from 'chai';
import {
  dateOfBirthSchema,
  firstNameSchema,
  lastNameSchema,
  veteranInformationSchema,
} from './veteran-information';

describe('Veteran Information Schemas', () => {
  describe('firstNameSchema', () => {
    describe('Valid Names', () => {
      it('should validate basic first name', () => {
        const result = firstNameSchema.safeParse('Boba');
        expect(result.success).to.be.true;
      });

      it('should validate hyphenated first name', () => {
        const result = firstNameSchema.safeParse('Cad-Bane');
        expect(result.success).to.be.true;
      });

      it('should validate name with apostrophe', () => {
        const result = firstNameSchema.safeParse("O'Reilly");
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
        const result = firstNameSchema.safeParse('Boba123');
        expect(result.success).to.be.false;
      });

      it('should reject names with special characters', () => {
        const result = firstNameSchema.safeParse('Boba@Fett');
        expect(result.success).to.be.false;
      });
    });
  });

  describe('lastNameSchema', () => {
    describe('Valid Last Names', () => {
      it('should validate basic last name', () => {
        const result = lastNameSchema.safeParse('Fett');
        expect(result.success).to.be.true;
      });

      it('should validate hyphenated last name', () => {
        const result = lastNameSchema.safeParse('Bane-Duros');
        expect(result.success).to.be.true;
      });

      it('should validate name with apostrophe', () => {
        const result = lastNameSchema.safeParse("D'Asta");
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
        const result = lastNameSchema.safeParse('Fett123');
        expect(result.success).to.be.false;
      });
    });
  });

  describe('dateOfBirthSchema', () => {
    describe('Valid Dates', () => {
      it('should validate birth date', () => {
        const result = dateOfBirthSchema.safeParse('1985-03-22');
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

      it('should validate various birthdates', () => {
        const dates = [
          '1958-01-06', // Jango
          '1962-07-13', // Cad Bane
          '1971-05-02', // Bossk
          '1979-04-18', // Zam Wesell
          '1983-11-29', // Aurra Sing
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
          firstName: 'Boba',
          lastName: 'Fett',
          dateOfBirth: '1985-03-22',
        });
        expect(result.success).to.be.true;
      });

      it('should validate veteran without middle name', () => {
        const result = veteranInformationSchema.safeParse({
          firstName: 'Jango',
          lastName: 'Fett',
          dateOfBirth: '1958-01-06',
        });
        expect(result.success).to.be.true;
      });
    });

    describe('Multiple Veteran Profiles', () => {
      it('should validate Bossk Trandoshan', () => {
        const result = veteranInformationSchema.safeParse({
          firstName: 'Bossk',
          lastName: 'Trandoshan',
          dateOfBirth: '1971-05-02',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Aurra Sing', () => {
        const result = veteranInformationSchema.safeParse({
          firstName: 'Aurra',
          lastName: 'Sing',
          dateOfBirth: '1983-11-29',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Greedo', () => {
        const result = veteranInformationSchema.safeParse({
          firstName: 'Greedo',
          lastName: 'Rodian',
          dateOfBirth: '1965-08-14',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Bossk', () => {
        const result = veteranInformationSchema.safeParse({
          firstName: 'Bossk',
          lastName: 'Trandoshan',
          dateOfBirth: '1977-09-21',
        });
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Veteran Information', () => {
      it('should reject missing firstName', () => {
        const result = veteranInformationSchema.safeParse({
          lastName: 'Fett',
          dateOfBirth: '1985-03-22',
        });
        expect(result.success).to.be.false;
      });

      it('should reject missing dateOfBirth', () => {
        const result = veteranInformationSchema.safeParse({
          firstName: 'Boba',
          lastName: 'Fett',
        });
        expect(result.success).to.be.false;
      });

      it('should reject invalid first name', () => {
        const result = veteranInformationSchema.safeParse({
          firstName: 'Boba123',
          lastName: 'Fett',
          dateOfBirth: '1985-03-22',
        });
        expect(result.success).to.be.false;
      });
    });

    describe('Edge Cases', () => {
      it('should handle minimum valid data', () => {
        const result = veteranInformationSchema.safeParse({
          firstName: 'J',
          lastName: 'K',
          dateOfBirth: '2000-01-01',
        });
        expect(result.success).to.be.true;
      });

      it('should handle maximum length names', () => {
        const result = veteranInformationSchema.safeParse({
          firstName: 'A'.repeat(30),
          lastName: 'C'.repeat(30),
          dateOfBirth: '2000-01-01',
        });
        expect(result.success).to.be.true;
      });

      it('should handle hyphenated and apostrophe names', () => {
        const result = veteranInformationSchema.safeParse({
          firstName: 'Din-Djarin',
          lastName: "D'Asta-Kryze",
          dateOfBirth: '1990-10-15',
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
