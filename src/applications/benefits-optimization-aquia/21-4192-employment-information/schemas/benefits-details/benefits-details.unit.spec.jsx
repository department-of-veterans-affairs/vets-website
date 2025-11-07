import { expect } from 'chai';
import {
  benefitTypeSchema,
  benefitsDetailsSchema,
  firstPaymentDateSchema,
  grossMonthlyAmountSchema,
  startReceivingDateSchema,
  stopReceivingDateSchema,
} from './benefits-details';

describe('benefitsDetailsSchema', () => {
  describe('benefitTypeSchema', () => {
    it('should accept optional string', () => {
      const result = benefitTypeSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should accept valid benefit type', () => {
      const result = benefitTypeSchema.safeParse('Retirement benefits');
      expect(result.success).to.be.true;
    });

    it('should reject strings over 500 characters', () => {
      const result = benefitTypeSchema.safeParse('a'.repeat(501));
      expect(result.success).to.be.false;
    });

    it('should accept strings up to 500 characters', () => {
      const result = benefitTypeSchema.safeParse('a'.repeat(500));
      expect(result.success).to.be.true;
    });
  });

  describe('grossMonthlyAmountSchema', () => {
    it('should accept optional string', () => {
      const result = grossMonthlyAmountSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should accept valid amount', () => {
      const result = grossMonthlyAmountSchema.safeParse('2000.00');
      expect(result.success).to.be.true;
    });

    it('should reject strings over 50 characters', () => {
      const result = grossMonthlyAmountSchema.safeParse('a'.repeat(51));
      expect(result.success).to.be.false;
    });
  });

  describe('startReceivingDateSchema', () => {
    it('should reject empty string', () => {
      const result = startReceivingDateSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should accept valid date', () => {
      const result = startReceivingDateSchema.safeParse('2023-01-15');
      expect(result.success).to.be.true;
    });

    it('should reject invalid date', () => {
      const result = startReceivingDateSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
    });
  });

  describe('firstPaymentDateSchema', () => {
    it('should reject empty string', () => {
      const result = firstPaymentDateSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should accept valid date', () => {
      const result = firstPaymentDateSchema.safeParse('2023-02-01');
      expect(result.success).to.be.true;
    });

    it('should reject invalid date', () => {
      const result = firstPaymentDateSchema.safeParse('not-a-date');
      expect(result.success).to.be.false;
    });
  });

  describe('stopReceivingDateSchema', () => {
    it('should accept empty string', () => {
      const result = stopReceivingDateSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should accept valid date', () => {
      const result = stopReceivingDateSchema.safeParse('2027-12-31');
      expect(result.success).to.be.true;
    });

    it('should reject invalid date', () => {
      const result = stopReceivingDateSchema.safeParse('bad-date');
      expect(result.success).to.be.false;
    });
  });

  describe('benefitsDetailsSchema', () => {
    it('should validate complete data', () => {
      const result = benefitsDetailsSchema.safeParse({
        benefitType: 'Education benefits',
        grossMonthlyAmount: '2000',
        startReceivingDate: '2023-01-15',
        firstPaymentDate: '2023-02-01',
        stopReceivingDate: '2027-12-31',
      });
      expect(result.success).to.be.true;
    });

    it('should validate with optional fields empty', () => {
      const result = benefitsDetailsSchema.safeParse({
        benefitType: '',
        grossMonthlyAmount: '',
        startReceivingDate: '2023-01-15',
        firstPaymentDate: '2023-02-01',
        stopReceivingDate: '',
      });
      expect(result.success).to.be.true;
    });

    it('should fail validation without required start date', () => {
      const result = benefitsDetailsSchema.safeParse({
        benefitType: 'Education benefits',
        grossMonthlyAmount: '2000',
        startReceivingDate: '',
        firstPaymentDate: '2023-02-01',
        stopReceivingDate: '',
      });
      expect(result.success).to.be.false;
    });

    it('should fail validation without required first payment date', () => {
      const result = benefitsDetailsSchema.safeParse({
        benefitType: 'Education benefits',
        grossMonthlyAmount: '2000',
        startReceivingDate: '2023-01-15',
        firstPaymentDate: '',
        stopReceivingDate: '',
      });
      expect(result.success).to.be.false;
    });

    it('should validate with minimal required data', () => {
      const result = benefitsDetailsSchema.safeParse({
        startReceivingDate: '2023-01-15',
        firstPaymentDate: '2023-02-01',
      });
      expect(result.success).to.be.true;
    });
  });
});
