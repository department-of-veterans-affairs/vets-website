import { expect } from 'chai';
import {
  currentDutyStatusSchema,
  disabilitiesPreventDutiesSchema,
  dutyStatusDetailsSchema,
} from './duty-status-details';

describe('dutyStatusDetailsSchema', () => {
  describe('currentDutyStatusSchema', () => {
    it('should accept optional string', () => {
      const result = currentDutyStatusSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should accept valid details', () => {
      const result = currentDutyStatusSchema.safeParse('Active duty status');
      expect(result.success).to.be.true;
    });

    it('should reject strings over 500 characters', () => {
      const result = currentDutyStatusSchema.safeParse('a'.repeat(501));
      expect(result.success).to.be.false;
    });

    it('should accept strings up to 500 characters', () => {
      const result = currentDutyStatusSchema.safeParse('a'.repeat(500));
      expect(result.success).to.be.true;
    });
  });

  describe('disabilitiesPreventDutiesSchema', () => {
    it('should accept "yes"', () => {
      const result = disabilitiesPreventDutiesSchema.safeParse('yes');
      expect(result.success).to.be.true;
    });

    it('should accept "no"', () => {
      const result = disabilitiesPreventDutiesSchema.safeParse('no');
      expect(result.success).to.be.true;
    });

    it('should accept empty string', () => {
      const result = disabilitiesPreventDutiesSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should reject invalid values', () => {
      const result = disabilitiesPreventDutiesSchema.safeParse('maybe');
      expect(result.success).to.be.false;
    });
  });

  describe('dutyStatusDetailsSchema', () => {
    it('should validate complete data', () => {
      const result = dutyStatusDetailsSchema.safeParse({
        currentDutyStatus: 'Reserve duty details',
        disabilitiesPreventDuties: 'yes',
      });
      expect(result.success).to.be.true;
    });

    it('should validate with empty values', () => {
      const result = dutyStatusDetailsSchema.safeParse({
        currentDutyStatus: '',
        disabilitiesPreventDuties: '',
      });
      expect(result.success).to.be.true;
    });

    it('should validate with partial data', () => {
      const result = dutyStatusDetailsSchema.safeParse({
        currentDutyStatus: 'Active reserve',
      });
      expect(result.success).to.be.true;
    });
  });
});
