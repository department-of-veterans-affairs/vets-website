import { expect } from 'chai';

import {
  admissionDateInfoSchema,
  admissionDateSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/admission-date/admission-date';

describe('Admission Date Schemas', () => {
  describe('admissionDateSchema', () => {
    it('should validate valid admission date', () => {
      const result = admissionDateSchema.safeParse('2020-01-15');
      expect(result.success).to.be.true;
    });

    it('should validate old admission date', () => {
      const result = admissionDateSchema.safeParse('2010-06-01');
      expect(result.success).to.be.true;
    });

    it('should validate today as admission date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = admissionDateSchema.safeParse(today);
      expect(result.success).to.be.true;
    });

    it('should validate date in YYYY-MM-DD format', () => {
      const result = admissionDateSchema.safeParse('2019-12-31');
      expect(result.success).to.be.true;
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      const result = admissionDateSchema.safeParse(futureDateString);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'cannot be in the future',
        );
      }
    });

    it('should reject tomorrow as admission date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      const result = admissionDateSchema.safeParse(tomorrowString);
      expect(result.success).to.be.false;
    });

    it('should reject empty admission date', () => {
      const result = admissionDateSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Admission date is required',
        );
      }
    });

    it('should reject invalid date string', () => {
      const result = admissionDateSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Please enter a valid date',
        );
      }
    });

    it('should reject invalid date format', () => {
      const result = admissionDateSchema.safeParse('13/32/2020');
      expect(result.success).to.be.false;
    });

    it('should reject null date', () => {
      const result = admissionDateSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined date', () => {
      const result = admissionDateSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should reject date with invalid month', () => {
      const result = admissionDateSchema.safeParse('2020-13-01');
      expect(result.success).to.be.false;
    });

    it('should reject date with invalid day', () => {
      const result = admissionDateSchema.safeParse('2020-01-32');
      expect(result.success).to.be.false;
    });

    it('should reject numeric date', () => {
      const result = admissionDateSchema.safeParse(20200115);
      expect(result.success).to.be.false;
    });

    it('should validate leap year date', () => {
      const result = admissionDateSchema.safeParse('2020-02-29');
      expect(result.success).to.be.true;
    });

    it('should accept non-leap year Feb 29 (JavaScript Date accepts and rolls over)', () => {
      const result = admissionDateSchema.safeParse('2019-02-29');

      expect(result.success).to.be.true;
    });
  });

  describe('admissionDateInfoSchema', () => {
    it('should validate complete admission date info', () => {
      const validData = {
        admissionDate: '2020-01-15',
      };
      const result = admissionDateInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with old date', () => {
      const validData = {
        admissionDate: '2000-06-01',
      };
      const result = admissionDateInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with today', () => {
      const today = new Date().toISOString().split('T')[0];
      const validData = {
        admissionDate: today,
      };
      const result = admissionDateInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing admissionDate', () => {
      const invalidData = {};
      const result = admissionDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty admissionDate', () => {
      const invalidData = {
        admissionDate: '',
      };
      const result = admissionDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject future admissionDate', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const invalidData = {
        admissionDate: futureDate.toISOString().split('T')[0],
      };
      const result = admissionDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid admissionDate format', () => {
      const invalidData = {
        admissionDate: 'invalid-date',
      };
      const result = admissionDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null admissionDate', () => {
      const invalidData = {
        admissionDate: null,
      };
      const result = admissionDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject undefined admissionDate', () => {
      const invalidData = {
        admissionDate: undefined,
      };
      const result = admissionDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
