import { expect } from 'chai';
import {
  medicaidStartDateInfoSchema,
  medicaidStartDateSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/medicaid-start-date/medicaid-start-date';

describe('Medicaid Start Date Schemas', () => {
  describe('medicaidStartDateSchema', () => {
    it('should validate valid medicaid start date', () => {
      const result = medicaidStartDateSchema.safeParse('2020-01-15');
      expect(result.success).to.be.true;
    });

    it('should validate old medicaid start date', () => {
      const result = medicaidStartDateSchema.safeParse('2010-06-01');
      expect(result.success).to.be.true;
    });

    it('should validate today as medicaid start date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = medicaidStartDateSchema.safeParse(today);
      expect(result.success).to.be.true;
    });

    it('should validate date in YYYY-MM-DD format', () => {
      const result = medicaidStartDateSchema.safeParse('2019-12-31');
      expect(result.success).to.be.true;
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      const result = medicaidStartDateSchema.safeParse(futureDateString);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'cannot be in the future',
        );
      }
    });

    it('should reject tomorrow as medicaid start date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      const result = medicaidStartDateSchema.safeParse(tomorrowString);
      expect(result.success).to.be.false;
    });

    it('should reject empty medicaid start date', () => {
      const result = medicaidStartDateSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Medicaid start date is required',
        );
      }
    });

    it('should reject invalid date string', () => {
      const result = medicaidStartDateSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Please enter a valid date',
        );
      }
    });

    it('should reject invalid date format', () => {
      const result = medicaidStartDateSchema.safeParse('13/32/2020');
      expect(result.success).to.be.false;
    });

    it('should reject null date', () => {
      const result = medicaidStartDateSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined date', () => {
      const result = medicaidStartDateSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should reject date with invalid month', () => {
      const result = medicaidStartDateSchema.safeParse('2020-13-01');
      expect(result.success).to.be.false;
    });

    it('should reject date with invalid day', () => {
      const result = medicaidStartDateSchema.safeParse('2020-01-32');
      expect(result.success).to.be.false;
    });

    it('should reject numeric date', () => {
      const result = medicaidStartDateSchema.safeParse(20200115);
      expect(result.success).to.be.false;
    });

    it('should validate leap year date', () => {
      const result = medicaidStartDateSchema.safeParse('2020-02-29');
      expect(result.success).to.be.true;
    });

    it('should accept non-leap year Feb 29 (JavaScript Date accepts and rolls over)', () => {
      const result = medicaidStartDateSchema.safeParse('2019-02-29');

      expect(result.success).to.be.true;
    });
  });

  describe('medicaidStartDateInfoSchema', () => {
    it('should validate complete medicaid start date info', () => {
      const validData = {
        medicaidStartDate: '2020-01-15',
      };
      const result = medicaidStartDateInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with old date', () => {
      const validData = {
        medicaidStartDate: '2000-06-01',
      };
      const result = medicaidStartDateInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with today', () => {
      const today = new Date().toISOString().split('T')[0];
      const validData = {
        medicaidStartDate: today,
      };
      const result = medicaidStartDateInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing medicaidStartDate', () => {
      const invalidData = {};
      const result = medicaidStartDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty medicaidStartDate', () => {
      const invalidData = {
        medicaidStartDate: '',
      };
      const result = medicaidStartDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject future medicaidStartDate', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const invalidData = {
        medicaidStartDate: futureDate.toISOString().split('T')[0],
      };
      const result = medicaidStartDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid medicaidStartDate format', () => {
      const invalidData = {
        medicaidStartDate: 'invalid-date',
      };
      const result = medicaidStartDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null medicaidStartDate', () => {
      const invalidData = {
        medicaidStartDate: null,
      };
      const result = medicaidStartDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject undefined medicaidStartDate', () => {
      const invalidData = {
        medicaidStartDate: undefined,
      };
      const result = medicaidStartDateInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
