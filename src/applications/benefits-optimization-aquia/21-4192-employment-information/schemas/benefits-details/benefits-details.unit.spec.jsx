import { expect } from 'chai';
import {
  benefitDetailsSchema,
  benefitsDetailsSchema,
} from './benefits-details';

describe('benefitsDetailsSchema', () => {
  describe('benefitDetailsSchema', () => {
    it('should accept optional string', () => {
      const result = benefitDetailsSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should accept valid details', () => {
      const result = benefitDetailsSchema.safeParse('Retirement benefits');
      expect(result.success).to.be.true;
    });
  });

  describe('benefitsDetailsSchema', () => {
    it('should validate complete data', () => {
      const result = benefitsDetailsSchema.safeParse({
        benefitDetails: 'Sick leave benefits',
      });
      expect(result.success).to.be.true;
    });
  });
});
