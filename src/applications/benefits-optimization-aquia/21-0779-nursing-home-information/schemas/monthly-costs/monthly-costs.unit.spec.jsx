import { expect } from 'chai';

import {
  monthlyOutOfPocketSchema,
  monthlyCostsSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/monthly-costs/monthly-costs';

describe('Monthly Costs Schemas', () => {
  describe('monthlyOutOfPocketSchema', () => {
    it('should validate valid dollar amount', () => {
      const result = monthlyOutOfPocketSchema.safeParse('1500');
      expect(result.success).to.be.true;
    });

    it('should validate dollar amount with decimal', () => {
      const result = monthlyOutOfPocketSchema.safeParse('1500.50');
      expect(result.success).to.be.true;
    });

    it('should validate dollar amount with commas', () => {
      const result = monthlyOutOfPocketSchema.safeParse('1,500.00');
      expect(result.success).to.be.true;
    });

    it('should validate dollar amount with dollar sign', () => {
      const result = monthlyOutOfPocketSchema.safeParse('$1500');
      expect(result.success).to.be.true;
    });

    it('should validate dollar amount with dollar sign and commas', () => {
      const result = monthlyOutOfPocketSchema.safeParse('$1,500.00');
      expect(result.success).to.be.true;
    });

    it('should validate zero amount', () => {
      const result = monthlyOutOfPocketSchema.safeParse('0');
      expect(result.success).to.be.true;
    });

    it('should validate zero with decimal', () => {
      const result = monthlyOutOfPocketSchema.safeParse('0.00');
      expect(result.success).to.be.true;
    });

    it('should validate large amount', () => {
      const result = monthlyOutOfPocketSchema.safeParse('10000.00');
      expect(result.success).to.be.true;
    });

    it('should validate amount with only cents', () => {
      const result = monthlyOutOfPocketSchema.safeParse('0.99');
      expect(result.success).to.be.true;
    });

    it('should reject empty amount', () => {
      const result = monthlyOutOfPocketSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Monthly out-of-pocket amount is required',
        );
      }
    });

    it('should accept negative amount string (schema strips minus sign)', () => {
      const result = monthlyOutOfPocketSchema.safeParse('-100');

      expect(result.success).to.be.true;
    });

    it('should reject amount with letters', () => {
      const result = monthlyOutOfPocketSchema.safeParse('ABC');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'valid dollar amount',
        );
      }
    });

    it('should accept amount with letters and numbers (schema strips letters)', () => {
      const result = monthlyOutOfPocketSchema.safeParse('123ABC');

      expect(result.success).to.be.true;
    });

    it('should reject null amount', () => {
      const result = monthlyOutOfPocketSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined amount', () => {
      const result = monthlyOutOfPocketSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should accept invalid characters (schema strips non-numeric)', () => {
      const result = monthlyOutOfPocketSchema.safeParse('$1,500@');

      expect(result.success).to.be.true;
    });

    it('should validate amount with multiple decimals cleaned', () => {
      const result = monthlyOutOfPocketSchema.safeParse('1500.99');
      expect(result.success).to.be.true;
    });

    it('should validate very large amount', () => {
      const result = monthlyOutOfPocketSchema.safeParse('$100,000.00');
      expect(result.success).to.be.true;
    });

    it('should validate amount with spaces', () => {
      const result = monthlyOutOfPocketSchema.safeParse('$ 1,500 .00');
      expect(result.success).to.be.true;
    });
  });

  describe('monthlyCostsSchema', () => {
    it('should validate complete monthly costs', () => {
      const validData = {
        monthlyOutOfPocket: '1500.00',
      };
      const result = monthlyCostsSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with formatted amount', () => {
      const validData = {
        monthlyOutOfPocket: '$1,500.00',
      };
      const result = monthlyCostsSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with zero amount', () => {
      const validData = {
        monthlyOutOfPocket: '0',
      };
      const result = monthlyCostsSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing monthlyOutOfPocket', () => {
      const invalidData = {};
      const result = monthlyCostsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty monthlyOutOfPocket', () => {
      const invalidData = {
        monthlyOutOfPocket: '',
      };
      const result = monthlyCostsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should accept negative monthlyOutOfPocket (schema strips minus)', () => {
      const invalidData = {
        monthlyOutOfPocket: '-100',
      };
      const result = monthlyCostsSchema.safeParse(invalidData);

      expect(result.success).to.be.true;
    });

    it('should reject invalid monthlyOutOfPocket format', () => {
      const invalidData = {
        monthlyOutOfPocket: 'invalid',
      };
      const result = monthlyCostsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null monthlyOutOfPocket', () => {
      const invalidData = {
        monthlyOutOfPocket: null,
      };
      const result = monthlyCostsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject undefined monthlyOutOfPocket', () => {
      const invalidData = {
        monthlyOutOfPocket: undefined,
      };
      const result = monthlyCostsSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
