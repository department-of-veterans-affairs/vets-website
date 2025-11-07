import { expect } from 'chai';
import {
  ssnSchema,
  vaFileNumberSchema,
  veteranContactInformationSchema,
} from './veteran-contact-information';

describe('veteranContactInformationSchema', () => {
  describe('ssnSchema', () => {
    it('should validate a valid SSN', () => {
      const result = ssnSchema.safeParse('123456789');
      expect(result.success).to.be.true;
    });

    it('should reject an invalid SSN', () => {
      const result = ssnSchema.safeParse('12345');
      expect(result.success).to.be.false;
    });
  });

  describe('vaFileNumberSchema', () => {
    it('should validate a valid VA file number', () => {
      const result = vaFileNumberSchema.safeParse('12345678');
      expect(result.success).to.be.true;
    });

    it('should accept empty string', () => {
      const result = vaFileNumberSchema.safeParse('');
      expect(result.success).to.be.true;
    });
  });

  describe('veteranContactInformationSchema', () => {
    it('should validate complete data', () => {
      const result = veteranContactInformationSchema.safeParse({
        ssn: '123456789',
        vaFileNumber: '12345678',
      });
      expect(result.success).to.be.true;
    });
  });
});
