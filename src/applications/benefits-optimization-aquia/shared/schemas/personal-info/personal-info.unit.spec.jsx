import { expect } from 'chai';
import {
  dateOfBirthSchema,
  personalInfoSchema,
  ssnSchema,
  vaFileNumberSchema,
} from './personal-info';

describe('Personal Info Schemas - Validation rules', () => {
  describe('dateOfBirthSchema', () => {
    it('validates date format', () => {
      const validDates = ['2000-01-01', '1950-12-31', '1985-06-15'];

      validDates.forEach(date => {
        const result = dateOfBirthSchema.safeParse(date);
        expect(result.success).to.be.true;
      });
    });

    it('rejects invalid formats', () => {
      const invalidDates = [
        '01-01-2000', // wrong format
        '2000/01/01', // wrong separator
        '2000-13-01', // invalid month
        '2000-01-32', // invalid day
        '2000-1-1', // missing leading zeros
        '',
      ];

      invalidDates.forEach(date => {
        const result = dateOfBirthSchema.safeParse(date);
        expect(result.success).to.be.false;
      });
    });

    it('reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const result = dateOfBirthSchema.safeParse(futureDateStr);
      expect(result.success).to.be.false;
      if (!result.success && result.error.issues.length > 0) {
        expect(result.error.issues[0].message).to.include('future');
      }
    });

    it('reject dates older than 150 years', () => {
      const veryOldDate = '1850-01-01';
      const result = dateOfBirthSchema.safeParse(veryOldDate);
      expect(result.success).to.be.false;
      if (!result.success && result.error.issues.length > 0) {
        expect(result.error.issues[0].message).to.include('150 years');
      }
    });

    it('accept today as valid date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = dateOfBirthSchema.safeParse(today);
      expect(result.success).to.be.true;
    });
  });

  describe('ssnSchema', () => {
    it('validate valid SSNs', () => {
      const validSSNs = [
        '227501138',
        '227-501-138',
        '227 501 138',
        '312415800',
      ];

      validSSNs.forEach(ssn => {
        const result = ssnSchema.safeParse(ssn);
        expect(result.success).to.be.true;
      });
    });

    it('transform formatted SSNs to digits only', () => {
      const formattedSSNs = [
        { input: '227-501-138', expected: '227501138' },
        { input: '227 501 138', expected: '227501138' },
        { input: '227501138', expected: '227501138' },
      ];

      formattedSSNs.forEach(({ input, expected }) => {
        const result = ssnSchema.safeParse(input);
        expect(result.success).to.be.true;
        expect(result.data).to.equal(expected);
      });
    });

    it('reject invalid SSNs', () => {
      const invalidSSNs = [
        '12345678', // too short
        '1227501138', // too long
        '12345678a', // contains letter
        '000000000', // all zeros (invalid SSN)
        '999999999', // all nines (invalid SSN)
        '',
      ];

      invalidSSNs.forEach(ssn => {
        const result = ssnSchema.safeParse(ssn);
        expect(result.success).to.be.false;
      });
    });

    it('reject SSNs with invalid area numbers', () => {
      const invalidAreaSSNs = ['000123456', '666123456'];

      invalidAreaSSNs.forEach(ssn => {
        const result = ssnSchema.safeParse(ssn);
        expect(result.success).to.be.false;
      });
    });

    it('provide appropriate error message', () => {
      const result = ssnSchema.safeParse('123');
      expect(result.success).to.be.false;
      if (!result.success && result.error.issues.length > 0) {
        expect(result.error.issues[0].message).to.include('9');
      }
    });
  });

  describe('vaFileNumberSchema', () => {
    it('validate valid VA file numbers', () => {
      const validNumbers = ['12345678', '123456789', ''];

      validNumbers.forEach(num => {
        const result = vaFileNumberSchema.safeParse(num);
        expect(result.success).to.be.true;
      });
    });

    it('transform empty string to undefined', () => {
      const result = vaFileNumberSchema.safeParse('');
      expect(result.success).to.be.true;
      expect(result.data).to.be.undefined;
    });

    it('allow undefined', () => {
      const result = vaFileNumberSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('reject invalid VA file numbers', () => {
      const invalidNumbers = [
        '1234567', // too short
        '1227501138', // too long
        '1234567a', // contains letter
        '12-345678', // contains dash
      ];

      invalidNumbers.forEach(num => {
        const result = vaFileNumberSchema.safeParse(num);
        expect(result.success).to.be.false;
      });
    });

    it('provide appropriate error message', () => {
      const result = vaFileNumberSchema.safeParse('123');
      expect(result.success).to.be.false;
      if (!result.success && result.error.issues.length > 0) {
        expect(result.error.issues[0].message).to.include('8 or 9');
      }
    });
  });

  describe('personalInfoSchema', () => {
    it('validate complete personal info', () => {
      const validInfo = {
        dateOfBirth: '1990-01-01',
        ssn: '227501138',
        vaFileNumber: '12345678',
      };

      const result = personalInfoSchema.safeParse(validInfo);
      expect(result.success).to.be.true;
    });

    it('validate personal info without optional VA file number', () => {
      const validInfo = {
        dateOfBirth: '1990-01-01',
        ssn: '227501138',
      };

      const result = personalInfoSchema.safeParse(validInfo);
      expect(result.success).to.be.true;
    });

    it('require date of birth and SSN', () => {
      const invalidInfos = [
        { dateOfBirth: '1990-01-01' }, // missing SSN
        { ssn: '123456789' }, // missing date of birth
        {}, // missing both
      ];

      invalidInfos.forEach(info => {
        const result = personalInfoSchema.safeParse(info);
        expect(result.success).to.be.false;
      });
    });

    it('transform formatted values', () => {
      const formattedInfo = {
        dateOfBirth: '1990-01-01',
        ssn: '227-501-138',
        vaFileNumber: '',
      };

      const result = personalInfoSchema.safeParse(formattedInfo);
      expect(result.success).to.be.true;
      expect(result.data.ssn).to.equal('227501138');
      expect(result.data.vaFileNumber).to.be.undefined;
    });

    it('validate all fields together', () => {
      const info = {
        dateOfBirth: '1985-06-15',
        ssn: '312-415-800',
        vaFileNumber: '312415800',
      };

      const result = personalInfoSchema.safeParse(info);
      expect(result.success).to.be.true;
      expect(result.data.dateOfBirth).to.equal('1985-06-15');
      expect(result.data.ssn).to.equal('312415800');
      expect(result.data.vaFileNumber).to.equal('312415800');
    });
  });
});
