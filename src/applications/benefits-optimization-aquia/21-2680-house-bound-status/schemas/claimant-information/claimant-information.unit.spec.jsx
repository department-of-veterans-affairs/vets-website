/**
 * Unit tests for claimant information schemas
 */

import { expect } from 'chai';
import {
  claimantDOBSchema,
  claimantInformationPageSchema,
} from './claimant-information';

describe('Claimant Information Schemas', () => {
  describe('claimantDOBSchema', () => {
    it('should validate valid date', () => {
      const result = claimantDOBSchema.safeParse('1990-05-15');
      expect(result.success).to.be.true;
    });

    it('should validate old date', () => {
      const result = claimantDOBSchema.safeParse('1920-01-01');
      expect(result.success).to.be.true;
    });

    it('should validate today as date of birth', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = claimantDOBSchema.safeParse(today);
      expect(result.success).to.be.true;
    });

    it('should validate recent past date', () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      const pastDateString = pastDate.toISOString().split('T')[0];
      const result = claimantDOBSchema.safeParse(pastDateString);
      expect(result.success).to.be.true;
    });

    it('should reject empty date', () => {
      const result = claimantDOBSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Date of birth is required',
        );
      }
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      const result = claimantDOBSchema.safeParse(futureDateString);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'cannot be in the future',
        );
      }
    });

    it('should reject invalid date string', () => {
      const result = claimantDOBSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('valid date');
      }
    });

    it('should reject invalid date format', () => {
      const result = claimantDOBSchema.safeParse('13/32/2020');
      expect(result.success).to.be.false;
    });

    it('should reject date with month out of range', () => {
      const result = claimantDOBSchema.safeParse('1990-13-01');
      expect(result.success).to.be.false;
    });

    it('should reject date with day out of range', () => {
      const result = claimantDOBSchema.safeParse('1990-02-30');
      expect(result.success).to.be.false;
    });

    it('should reject null', () => {
      const result = claimantDOBSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined', () => {
      const result = claimantDOBSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should reject numeric values', () => {
      const result = claimantDOBSchema.safeParse(20200101);
      expect(result.success).to.be.false;
    });

    it('should validate leap year date', () => {
      const result = claimantDOBSchema.safeParse('2020-02-29');
      expect(result.success).to.be.true;
    });

    it('should reject invalid leap year date', () => {
      const result = claimantDOBSchema.safeParse('2019-02-29');
      expect(result.success).to.be.false;
    });
  });

  describe('claimantInformationPageSchema', () => {
    it('should validate complete page data', () => {
      const validData = {
        claimantFullName: {
          first: 'Ahsoka',
          middle: 'Fulcrum',
          last: 'Tano',
        },
        claimantDOB: '1990-05-15',
      };
      const result = claimantInformationPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate page data without middle name', () => {
      const validData = {
        claimantFullName: {
          first: 'Ahsoka',
          middle: '',
          last: 'Tano',
        },
        claimantDOB: '1990-05-15',
      };
      const result = claimantInformationPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing claimantFullName', () => {
      const invalidData = {
        claimantDOB: '1990-05-15',
      };
      const result = claimantInformationPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing claimantDOB', () => {
      const invalidData = {
        claimantFullName: {
          first: 'Ahsoka',
          middle: '',
          last: 'Tano',
        },
      };
      const result = claimantInformationPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid claimantFullName (missing first)', () => {
      const invalidData = {
        claimantFullName: {
          first: '',
          middle: '',
          last: 'Tano',
        },
        claimantDOB: '1990-05-15',
      };
      const result = claimantInformationPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid claimantFullName (missing last)', () => {
      const invalidData = {
        claimantFullName: {
          first: 'Ahsoka',
          middle: '',
          last: '',
        },
        claimantDOB: '1990-05-15',
      };
      const result = claimantInformationPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid claimantDOB (future date)', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const invalidData = {
        claimantFullName: {
          first: 'Ahsoka',
          middle: '',
          last: 'Tano',
        },
        claimantDOB: futureDate.toISOString().split('T')[0],
      };
      const result = claimantInformationPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid claimantDOB (empty string)', () => {
      const invalidData = {
        claimantFullName: {
          first: 'Ahsoka',
          middle: '',
          last: 'Tano',
        },
        claimantDOB: '',
      };
      const result = claimantInformationPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty object', () => {
      const invalidData = {};
      const result = claimantInformationPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should validate with hyphenated names', () => {
      const validData = {
        claimantFullName: {
          first: 'Leia',
          middle: '',
          last: 'Organa-Solo',
        },
        claimantDOB: '1990-05-15',
      };
      const result = claimantInformationPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });
  });
});
