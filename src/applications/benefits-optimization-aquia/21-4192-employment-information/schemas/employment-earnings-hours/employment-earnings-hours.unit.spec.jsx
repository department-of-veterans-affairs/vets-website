import { expect } from 'chai';
import {
  amountEarnedSchema,
  employmentEarningsHoursSchema,
} from './employment-earnings-hours';

describe('employmentEarningsHoursSchema', () => {
  describe('amountEarnedSchema', () => {
    it('should accept optional string', () => {
      const result = amountEarnedSchema.safeParse('');
      expect(result.success).to.be.true;
    });
  });

  describe('employmentEarningsHoursSchema', () => {
    it('should validate complete data', () => {
      const result = employmentEarningsHoursSchema.safeParse({
        amountEarned: '50000',
        timeLost: '2 weeks',
        dailyHours: '8',
        weeklyHours: '40',
      });
      expect(result.success).to.be.true;
    });
  });
});
