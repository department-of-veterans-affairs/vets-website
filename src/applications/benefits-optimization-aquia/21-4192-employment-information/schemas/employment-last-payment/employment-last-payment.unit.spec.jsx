/**
 * @module tests/schemas/employment-last-payment.unit.spec
 * @description Unit tests for employment last payment validation schemas
 */

import { expect } from 'chai';
import {
  dateOfLastPaymentSchema,
  grossAmountLastPaymentSchema,
  lumpSumPaymentSchema,
  grossAmountPaidSchema,
  datePaidSchema,
  employmentLastPaymentSchema,
} from './employment-last-payment';

describe('Employment Last Payment Schemas', () => {
  describe('dateOfLastPaymentSchema', () => {
    it('should reject empty string', () => {
      expect(dateOfLastPaymentSchema.safeParse('').success).to.be.false;
    });

    it('should validate valid date', () => {
      expect(dateOfLastPaymentSchema.safeParse('2015-12-15').success).to.be
        .true;
    });

    it('should validate date', () => {
      expect(dateOfLastPaymentSchema.safeParse('2020-12-25').success).to.be
        .true;
    });

    it('should reject undefined', () => {
      expect(dateOfLastPaymentSchema.safeParse(undefined).success).to.be.false;
    });

    it('should reject invalid date', () => {
      expect(dateOfLastPaymentSchema.safeParse('invalid-date').success).to.be
        .false;
    });

    it('should reject malformed date', () => {
      expect(dateOfLastPaymentSchema.safeParse('2015-13-45').success).to.be
        .false;
    });
  });

  describe('grossAmountLastPaymentSchema', () => {
    it('should validate empty string', () => {
      expect(grossAmountLastPaymentSchema.safeParse('').success).to.be.true;
    });

    it('should validate currency amount', () => {
      expect(grossAmountLastPaymentSchema.safeParse('5000').success).to.be.true;
    });

    it('should validate currency with decimals', () => {
      expect(grossAmountLastPaymentSchema.safeParse('5500.50').success).to.be
        .true;
    });

    it('should validate 50 character string', () => {
      expect(grossAmountLastPaymentSchema.safeParse('1'.repeat(50)).success).to
        .be.true;
    });

    it('should reject over 50 characters', () => {
      expect(grossAmountLastPaymentSchema.safeParse('1'.repeat(51)).success).to
        .be.false;
    });

    it('should validate undefined', () => {
      expect(grossAmountLastPaymentSchema.safeParse(undefined).success).to.be
        .true;
    });

    it('should validate large amount', () => {
      expect(grossAmountLastPaymentSchema.safeParse('125000.00').success).to.be
        .true;
    });

    it('should validate themed amount', () => {
      expect(grossAmountLastPaymentSchema.safeParse('7500').success).to.be.true;
    });
  });

  describe('lumpSumPaymentSchema', () => {
    it('should validate "yes"', () => {
      expect(lumpSumPaymentSchema.safeParse('yes').success).to.be.true;
    });

    it('should validate "no"', () => {
      expect(lumpSumPaymentSchema.safeParse('no').success).to.be.true;
    });

    it('should validate empty string', () => {
      expect(lumpSumPaymentSchema.safeParse('').success).to.be.true;
    });

    it('should validate undefined', () => {
      expect(lumpSumPaymentSchema.safeParse(undefined).success).to.be.true;
    });

    it('should reject invalid value', () => {
      expect(lumpSumPaymentSchema.safeParse('maybe').success).to.be.false;
    });

    it('should reject numeric value', () => {
      expect(lumpSumPaymentSchema.safeParse('1').success).to.be.false;
    });

    it('should reject case-sensitive variations', () => {
      expect(lumpSumPaymentSchema.safeParse('Yes').success).to.be.false;
      expect(lumpSumPaymentSchema.safeParse('No').success).to.be.false;
    });
  });

  describe('grossAmountPaidSchema', () => {
    it('should validate empty string', () => {
      expect(grossAmountPaidSchema.safeParse('').success).to.be.true;
    });

    it('should validate currency amount', () => {
      expect(grossAmountPaidSchema.safeParse('50000').success).to.be.true;
    });

    it('should validate currency with decimals', () => {
      expect(grossAmountPaidSchema.safeParse('45000.00').success).to.be.true;
    });

    it('should validate 50 character string', () => {
      expect(grossAmountPaidSchema.safeParse('1'.repeat(50)).success).to.be
        .true;
    });

    it('should reject over 50 characters', () => {
      expect(grossAmountPaidSchema.safeParse('1'.repeat(51)).success).to.be
        .false;
    });

    it('should validate undefined', () => {
      expect(grossAmountPaidSchema.safeParse(undefined).success).to.be.true;
    });

    it('should validate themed lump sum', () => {
      expect(grossAmountPaidSchema.safeParse('75000').success).to.be.true;
    });
  });

  describe('datePaidSchema', () => {
    it('should validate empty string', () => {
      expect(datePaidSchema.safeParse('').success).to.be.true;
    });

    it('should validate valid date', () => {
      expect(datePaidSchema.safeParse('2015-12-31').success).to.be.true;
    });

    it('should validate date', () => {
      expect(datePaidSchema.safeParse('2020-12-31').success).to.be.true;
    });

    it('should validate undefined', () => {
      expect(datePaidSchema.safeParse(undefined).success).to.be.true;
    });

    it('should reject invalid date', () => {
      expect(datePaidSchema.safeParse('not-a-date').success).to.be.false;
    });

    it('should reject malformed date', () => {
      expect(datePaidSchema.safeParse('2015-15-99').success).to.be.false;
    });
  });

  describe('employmentLastPaymentSchema', () => {
    it('should validate complete schema', () => {
      const data = {
        dateOfLastPayment: '2015-12-15',
        grossAmountLastPayment: '5000',
        lumpSumPayment: 'yes',
        grossAmountPaid: '50000',
        datePaid: '2015-12-31',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.true;
    });

    it('should validate with lumpSumPayment as "no"', () => {
      const data = {
        dateOfLastPayment: '2015-12-15',
        grossAmountLastPayment: '5000',
        lumpSumPayment: 'no',
        grossAmountPaid: '',
        datePaid: '',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.true;
    });

    it('should validate partial data', () => {
      const data = {
        dateOfLastPayment: '2015-12-15',
        grossAmountLastPayment: '',
        lumpSumPayment: '',
        grossAmountPaid: '',
        datePaid: '',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.true;
    });

    it('should reject empty object', () => {
      const data = {};
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.false;
    });

    it('should validate themed data', () => {
      const data = {
        dateOfLastPayment: '2020-12-25',
        grossAmountLastPayment: '7500',
        lumpSumPayment: 'yes',
        grossAmountPaid: '75000',
        datePaid: '2020-12-31',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.true;
    });

    it('should reject invalid dates', () => {
      const data = {
        dateOfLastPayment: 'invalid',
        grossAmountLastPayment: '',
        lumpSumPayment: '',
        grossAmountPaid: '',
        datePaid: '',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.false;
    });

    it('should reject invalid lumpSumPayment value', () => {
      const data = {
        dateOfLastPayment: '',
        grossAmountLastPayment: '',
        lumpSumPayment: 'maybe',
        grossAmountPaid: '',
        datePaid: '',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.false;
    });

    it('should reject overly long amount strings', () => {
      const data = {
        dateOfLastPayment: '',
        grossAmountLastPayment: '1'.repeat(51),
        lumpSumPayment: '',
        grossAmountPaid: '',
        datePaid: '',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.false;
    });

    it('should validate with only date of last payment filled', () => {
      const data = {
        dateOfLastPayment: '2015-12-15',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.true;
    });

    it('should reject lump sum data without required date of last payment', () => {
      const data = {
        lumpSumPayment: 'yes',
        grossAmountPaid: '50000',
        datePaid: '2015-12-31',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.false;
    });

    it('should reject when lumpSumPayment is yes but grossAmountPaid is missing', () => {
      const data = {
        dateOfLastPayment: '2015-12-15',
        grossAmountLastPayment: '5000',
        lumpSumPayment: 'yes',
        grossAmountPaid: '',
        datePaid: '2015-12-31',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.false;
    });

    it('should reject when lumpSumPayment is yes but datePaid is missing', () => {
      const data = {
        dateOfLastPayment: '2015-12-15',
        grossAmountLastPayment: '5000',
        lumpSumPayment: 'yes',
        grossAmountPaid: '50000',
        datePaid: '',
      };
      expect(employmentLastPaymentSchema.safeParse(data).success).to.be.false;
    });
  });
});
