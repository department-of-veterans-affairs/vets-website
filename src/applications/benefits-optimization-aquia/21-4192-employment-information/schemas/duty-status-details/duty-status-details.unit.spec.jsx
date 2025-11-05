import { expect } from 'chai';
import {
  dutyStatusDetailsSchema,
  statusDetailsSchema,
} from './duty-status-details';

describe('dutyStatusDetailsSchema', () => {
  describe('statusDetailsSchema', () => {
    it('should accept optional string', () => {
      const result = statusDetailsSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should accept valid details', () => {
      const result = statusDetailsSchema.safeParse('Active duty status');
      expect(result.success).to.be.true;
    });
  });

  describe('dutyStatusDetailsSchema', () => {
    it('should validate complete data', () => {
      const result = dutyStatusDetailsSchema.safeParse({
        statusDetails: 'Reserve duty details',
      });
      expect(result.success).to.be.true;
    });
  });
});
