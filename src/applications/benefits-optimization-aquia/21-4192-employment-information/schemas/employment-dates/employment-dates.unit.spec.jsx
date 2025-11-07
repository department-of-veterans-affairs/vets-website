/**
 * @module tests/schemas/employment-dates.unit.spec
 * @description Unit tests for employment dates validation schemas
 */

import { expect } from 'chai';
import {
  beginningDateSchema,
  currentlyEmployedSchema,
  employmentDatesSchema,
  endingDateSchema,
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

  describe('currentlyEmployedSchema', () => {
    it('should validate true', () => {
      expect(currentlyEmployedSchema.safeParse(true).success).to.be.true;
    });

    it('should validate false', () => {
      expect(currentlyEmployedSchema.safeParse(false).success).to.be.true;
    });

    it('should validate undefined', () => {
      expect(currentlyEmployedSchema.safeParse(undefined).success).to.be.true;
    });
  });

  describe('employmentDatesSchema', () => {
    it('should validate complete schema', () => {
      const data = {
        beginningDate: '2010-01-01',
        endingDate: '2015-12-31',
        currentlyEmployed: false,
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.true;
    });

    it('should validate partial data', () => {
      const data = {
        beginningDate: '2010-01-01',
        endingDate: '',
        currentlyEmployed: false,
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
        currentlyEmployed: false,
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.true;
    });

    it('should validate currently employed', () => {
      const data = {
        beginningDate: '2010-01-01',
        currentlyEmployed: true,
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.true;
    });

    it('should reject invalid dates', () => {
      const data = {
        beginningDate: 'invalid',
        endingDate: 'invalid',
        currentlyEmployed: false,
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.false;
    });

    it('should validate with all fields filled', () => {
      const data = {
        beginningDate: '2010-01-01',
        endingDate: '2015-12-31',
        currentlyEmployed: false,
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.true;
    });

    it('should validate without ending date when currently employed', () => {
      const data = {
        beginningDate: '2010-01-01',
        currentlyEmployed: true,
      };
      expect(employmentDatesSchema.safeParse(data).success).to.be.true;
    });
  });
});
