/**
 * @module tests/schemas/employment-dates-details.unit.spec
 * @description Unit tests for employment dates and details validation schemas
 */

import { expect } from 'chai';
import {
  beginningDateSchema,
  endingDateSchema,
  typeOfWorkSchema,
  amountEarnedSchema,
  timeLostSchema,
  dailyHoursSchema,
  weeklyHoursSchema,
  employmentDatesDetailsSchema,
} from './employment-dates-details';

describe('Employment Dates and Details Schemas', () => {
  describe('beginningDateSchema', () => {
    it('should validate empty string', () => {
      expect(beginningDateSchema.safeParse('').success).to.be.true;
    });

    it('should validate valid date', () => {
      expect(beginningDateSchema.safeParse('2250-01-01').success).to.be.true;
    });

    it('should validate Star Trek date', () => {
      expect(beginningDateSchema.safeParse('2233-03-22').success).to.be.true;
    });

    it('should validate undefined', () => {
      expect(beginningDateSchema.safeParse(undefined).success).to.be.true;
    });

    it('should reject invalid date', () => {
      expect(beginningDateSchema.safeParse('invalid-date').success).to.be.false;
    });

    it('should reject malformed date', () => {
      expect(beginningDateSchema.safeParse('2250-13-45').success).to.be.false;
    });
  });

  describe('endingDateSchema', () => {
    it('should validate empty string', () => {
      expect(endingDateSchema.safeParse('').success).to.be.true;
    });

    it('should validate valid date', () => {
      expect(endingDateSchema.safeParse('2265-12-31').success).to.be.true;
    });

    it('should validate Star Trek date', () => {
      expect(endingDateSchema.safeParse('2293-12-31').success).to.be.true;
    });

    it('should validate undefined', () => {
      expect(endingDateSchema.safeParse(undefined).success).to.be.true;
    });

    it('should reject invalid date', () => {
      expect(endingDateSchema.safeParse('not-a-date').success).to.be.false;
    });
  });

  describe('typeOfWorkSchema', () => {
    it('should validate empty string', () => {
      expect(typeOfWorkSchema.safeParse('').success).to.be.true;
    });

    it('should validate work description', () => {
      expect(typeOfWorkSchema.safeParse('Starship Command').success).to.be.true;
    });

    it('should validate long work description', () => {
      expect(
        typeOfWorkSchema.safeParse(
          'Commanding officer of USS Enterprise, responsible for crew of 430 personnel',
        ).success,
      ).to.be.true;
    });

    it('should validate 1000 character string', () => {
      expect(typeOfWorkSchema.safeParse('A'.repeat(1000)).success).to.be.true;
    });

    it('should reject over 1000 characters', () => {
      expect(typeOfWorkSchema.safeParse('A'.repeat(1001)).success).to.be.false;
    });

    it('should validate undefined', () => {
      expect(typeOfWorkSchema.safeParse(undefined).success).to.be.true;
    });

    it('should validate Star Trek themed work', () => {
      expect(
        typeOfWorkSchema.safeParse(
          'Bridge operations, tactical analysis, diplomatic missions',
        ).success,
      ).to.be.true;
    });
  });

  describe('amountEarnedSchema', () => {
    it('should validate empty string', () => {
      expect(amountEarnedSchema.safeParse('').success).to.be.true;
    });

    it('should validate currency amount', () => {
      expect(amountEarnedSchema.safeParse('75000').success).to.be.true;
    });

    it('should validate currency with decimals', () => {
      expect(amountEarnedSchema.safeParse('75000.50').success).to.be.true;
    });

    it('should validate 100 character string', () => {
      expect(amountEarnedSchema.safeParse('1'.repeat(100)).success).to.be.true;
    });

    it('should reject over 100 characters', () => {
      expect(amountEarnedSchema.safeParse('1'.repeat(101)).success).to.be.false;
    });

    it('should validate undefined', () => {
      expect(amountEarnedSchema.safeParse(undefined).success).to.be.true;
    });

    it('should validate large amount', () => {
      expect(amountEarnedSchema.safeParse('125000.00').success).to.be.true;
    });
  });

  describe('timeLostSchema', () => {
    it('should validate empty string', () => {
      expect(timeLostSchema.safeParse('').success).to.be.true;
    });

    it('should validate time description', () => {
      expect(timeLostSchema.safeParse('30 days').success).to.be.true;
    });

    it('should validate detailed time description', () => {
      expect(timeLostSchema.safeParse('45 days medical leave').success).to.be
        .true;
    });

    it('should validate 100 character string', () => {
      expect(timeLostSchema.safeParse('A'.repeat(100)).success).to.be.true;
    });

    it('should reject over 100 characters', () => {
      expect(timeLostSchema.safeParse('A'.repeat(101)).success).to.be.false;
    });

    it('should validate undefined', () => {
      expect(timeLostSchema.safeParse(undefined).success).to.be.true;
    });

    it('should validate Star Trek themed time lost', () => {
      expect(timeLostSchema.safeParse('2 weeks sickbay recovery').success).to.be
        .true;
    });
  });

  describe('dailyHoursSchema', () => {
    it('should validate empty string', () => {
      expect(dailyHoursSchema.safeParse('').success).to.be.true;
    });

    it('should validate hours number', () => {
      expect(dailyHoursSchema.safeParse('8').success).to.be.true;
    });

    it('should validate hours with decimals', () => {
      expect(dailyHoursSchema.safeParse('8.5').success).to.be.true;
    });

    it('should validate 50 character string', () => {
      expect(dailyHoursSchema.safeParse('1'.repeat(50)).success).to.be.true;
    });

    it('should reject over 50 characters', () => {
      expect(dailyHoursSchema.safeParse('1'.repeat(51)).success).to.be.false;
    });

    it('should validate undefined', () => {
      expect(dailyHoursSchema.safeParse(undefined).success).to.be.true;
    });

    it('should validate long shift hours', () => {
      expect(dailyHoursSchema.safeParse('10').success).to.be.true;
    });
  });

  describe('weeklyHoursSchema', () => {
    it('should validate empty string', () => {
      expect(weeklyHoursSchema.safeParse('').success).to.be.true;
    });

    it('should validate hours number', () => {
      expect(weeklyHoursSchema.safeParse('40').success).to.be.true;
    });

    it('should validate hours with decimals', () => {
      expect(weeklyHoursSchema.safeParse('42.5').success).to.be.true;
    });

    it('should validate 50 character string', () => {
      expect(weeklyHoursSchema.safeParse('1'.repeat(50)).success).to.be.true;
    });

    it('should reject over 50 characters', () => {
      expect(weeklyHoursSchema.safeParse('1'.repeat(51)).success).to.be.false;
    });

    it('should validate undefined', () => {
      expect(weeklyHoursSchema.safeParse(undefined).success).to.be.true;
    });

    it('should validate overtime hours', () => {
      expect(weeklyHoursSchema.safeParse('50').success).to.be.true;
    });
  });

  describe('employmentDatesDetailsSchema', () => {
    it('should validate complete schema', () => {
      const data = {
        beginningDate: '2250-01-01',
        endingDate: '2265-12-31',
        typeOfWork: 'Starship Command',
        amountEarned: '75000',
        timeLost: '30 days',
        dailyHours: '8',
        weeklyHours: '40',
      };
      expect(employmentDatesDetailsSchema.safeParse(data).success).to.be.true;
    });

    it('should validate partial data', () => {
      const data = {
        beginningDate: '2250-01-01',
        endingDate: '',
        typeOfWork: '',
        amountEarned: '',
        timeLost: '',
        dailyHours: '',
        weeklyHours: '',
      };
      expect(employmentDatesDetailsSchema.safeParse(data).success).to.be.true;
    });

    it('should validate empty object', () => {
      const data = {};
      expect(employmentDatesDetailsSchema.safeParse(data).success).to.be.true;
    });

    it('should validate Star Trek themed data', () => {
      const data = {
        beginningDate: '2233-03-22',
        endingDate: '2293-12-31',
        typeOfWork: 'Commanding officer of USS Enterprise',
        amountEarned: '125000',
        timeLost: '2 weeks sickbay',
        dailyHours: '10',
        weeklyHours: '50',
      };
      expect(employmentDatesDetailsSchema.safeParse(data).success).to.be.true;
    });

    it('should reject invalid dates', () => {
      const data = {
        beginningDate: 'invalid',
        endingDate: 'invalid',
        typeOfWork: '',
        amountEarned: '',
        timeLost: '',
        dailyHours: '',
        weeklyHours: '',
      };
      expect(employmentDatesDetailsSchema.safeParse(data).success).to.be.false;
    });

    it('should reject overly long type of work', () => {
      const data = {
        beginningDate: '',
        endingDate: '',
        typeOfWork: 'A'.repeat(1001),
        amountEarned: '',
        timeLost: '',
        dailyHours: '',
        weeklyHours: '',
      };
      expect(employmentDatesDetailsSchema.safeParse(data).success).to.be.false;
    });

    it('should validate with only required fields filled', () => {
      const data = {
        beginningDate: '2250-01-01',
        endingDate: '2265-12-31',
        typeOfWork: 'Bridge operations',
      };
      expect(employmentDatesDetailsSchema.safeParse(data).success).to.be.true;
    });
  });
});
