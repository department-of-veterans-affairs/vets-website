/**
 * @module tests/schemas/employment-dates.unit.spec
 * @description Unit tests for employment dates validation schemas
 */

import { expect } from 'chai';
import {
  beginningDateSchema,
  endingDateSchema,
  typeOfWorkSchema,
  employmentDatesSchema,
} from './employment-dates';

describe('Employment Dates Schemas', () => {
  describe('beginningDateSchema', () => {
    it('should validate empty string', () => {
      expect(beginningDateSchema.safeParse('').success).to.be.true;
    });

    it('should validate valid date', () => {
      expect(beginningDateSchema.safeParse('2010-01-01').success).to.be.true;
    });

    it('should validate date', () => {
      expect(beginningDateSchema.safeParse('1985-03-22').success).to.be.true;
    });

    it('should validate undefined', () => {
      expect(beginningDateSchema.safeParse(undefined).success).to.be.true;
    });

    it('should reject invalid date', () => {
      expect(beginningDateSchema.safeParse('invalid-date').success).to.be.false;
    });

    it('should reject malformed date', () => {
      expect(beginningDateSchema.safeParse('2010-13-45').success).to.be.false;
    });
  });

  describe('endingDateSchema', () => {
    it('should validate empty string', () => {
      expect(endingDateSchema.safeParse('').success).to.be.true;
    });

    it('should validate valid date', () => {
      expect(endingDateSchema.safeParse('2015-12-31').success).to.be.true;
    });

    it('should validate date', () => {
      expect(endingDateSchema.safeParse('2020-12-31').success).to.be.true;
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
          'Commanding officer of Slave I, responsible for crew of 430 personnel',
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

    it('should validate themed work', () => {
      expect(
        typeOfWorkSchema.safeParse(
          'Bridge operations, tactical analysis, diplomatic missions',
        ).success,
      ).to.be.true;
    });
  });

  describe('employmentDatesSchema', () => {
    it('should validate complete schema', () => {
      const data = {
        beginningDate: '2010-01-01',
        endingDate: '2015-12-31',
        typeOfWork: 'Starship Command',
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.true;
    });

    it('should validate partial data', () => {
      const data = {
        beginningDate: '2010-01-01',
        endingDate: '',
        typeOfWork: '',
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.true;
    });

    it('should validate empty object', () => {
      const data = {};
      expect(employmentDatesSchema.safeParse(data).success).to.be.true;
    });

    it('should validate themed data', () => {
      const data = {
        beginningDate: '1985-03-22',
        endingDate: '2020-12-31',
        typeOfWork: 'Commanding officer of Slave I',
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.true;
    });

    it('should reject invalid dates', () => {
      const data = {
        beginningDate: 'invalid',
        endingDate: 'invalid',
        typeOfWork: '',
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.false;
    });

    it('should reject overly long type of work', () => {
      const data = {
        beginningDate: '',
        endingDate: '',
        typeOfWork: 'A'.repeat(1001),
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.false;
    });

    it('should validate with all fields filled', () => {
      const data = {
        beginningDate: '2010-01-01',
        endingDate: '2015-12-31',
        typeOfWork: 'Bridge operations',
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.true;
    });
  });
});
