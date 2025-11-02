import { expect } from 'chai';
import {
  claimantPersonalInfoSchema,
  claimantIdentificationInfoSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/claimant-identification/claimant-identification';

describe('Claimant Identification Schemas', () => {
  describe('claimantPersonalInfoSchema', () => {
    it('should validate complete claimant personal info', () => {
      const validData = {
        claimantFullName: {
          first: 'Jane',
          middle: 'Marie',
          last: 'Doe',
        },
        claimantDateOfBirth: '1990-05-15',
      };
      const result = claimantPersonalInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate claimant personal info without middle name', () => {
      const validData = {
        claimantFullName: {
          first: 'Jane',
          middle: '',
          last: 'Doe',
        },
        claimantDateOfBirth: '1990-05-15',
      };
      const result = claimantPersonalInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with hyphenated names', () => {
      const validData = {
        claimantFullName: {
          first: 'Mary-Ann',
          middle: '',
          last: 'Smith-Jones',
        },
        claimantDateOfBirth: '1985-12-25',
      };
      const result = claimantPersonalInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing claimantFullName', () => {
      const invalidData = {
        claimantDateOfBirth: '1990-05-15',
      };
      const result = claimantPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject missing claimantDateOfBirth', () => {
      const invalidData = {
        claimantFullName: {
          first: 'Jane',
          middle: 'Marie',
          last: 'Doe',
        },
      };
      const result = claimantPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty first name', () => {
      const invalidData = {
        claimantFullName: {
          first: '',
          middle: 'Marie',
          last: 'Doe',
        },
        claimantDateOfBirth: '1990-05-15',
      };
      const result = claimantPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty last name', () => {
      const invalidData = {
        claimantFullName: {
          first: 'Jane',
          middle: 'Marie',
          last: '',
        },
        claimantDateOfBirth: '1990-05-15',
      };
      const result = claimantPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid date format', () => {
      const invalidData = {
        claimantFullName: {
          first: 'Jane',
          middle: 'Marie',
          last: 'Doe',
        },
        claimantDateOfBirth: 'invalid-date',
      };
      const result = claimantPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty claimantDateOfBirth', () => {
      const invalidData = {
        claimantFullName: {
          first: 'Jane',
          middle: 'Marie',
          last: 'Doe',
        },
        claimantDateOfBirth: '',
      };
      const result = claimantPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty object', () => {
      const invalidData = {};
      const result = claimantPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null values', () => {
      const invalidData = {
        claimantFullName: null,
        claimantDateOfBirth: null,
      };
      const result = claimantPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject first name with numbers', () => {
      const invalidData = {
        claimantFullName: {
          first: 'Jane123',
          middle: 'Marie',
          last: 'Doe',
        },
        claimantDateOfBirth: '1990-05-15',
      };
      const result = claimantPersonalInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });

  describe('claimantIdentificationInfoSchema', () => {
    it('should validate complete claimant identification info', () => {
      const validData = {
        claimantSsn: '987-65-4321',
        claimantVaFileNumber: '87654321',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate claimant identification info without VA file number', () => {
      const validData = {
        claimantSsn: '987654321',
        claimantVaFileNumber: '',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate with SSN with dashes', () => {
      const validData = {
        claimantSsn: '987-65-4321',
        claimantVaFileNumber: '',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject undefined SSN (required in schema)', () => {
      const validData = {
        claimantSsn: undefined,
        claimantVaFileNumber: '87654321',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);

      expect(result.success).to.be.false;
    });

    it('should validate with 9-digit VA file number', () => {
      const validData = {
        claimantSsn: '987654321',
        claimantVaFileNumber: '876543210',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject with both fields empty/undefined when SSN is undefined', () => {
      const validData = {
        claimantSsn: undefined,
        claimantVaFileNumber: '',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid SSN format with insufficient digits', () => {
      const validData = {
        claimantSsn: '123',
        claimantVaFileNumber: '',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid VA file number format', () => {
      const validData = {
        claimantSsn: '987654321',
        claimantVaFileNumber: '123',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.false;
    });

    it('should reject SSN with letters', () => {
      const validData = {
        claimantSsn: '98765432A',
        claimantVaFileNumber: '',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.false;
    });

    it('should reject VA file number with letters', () => {
      const validData = {
        claimantSsn: '987654321',
        claimantVaFileNumber: '8765432A',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.false;
    });

    it('should reject VA file number with 7 digits', () => {
      const validData = {
        claimantSsn: '987654321',
        claimantVaFileNumber: '1234567',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.false;
    });

    it('should reject VA file number with 10 digits', () => {
      const validData = {
        claimantSsn: '987654321',
        claimantVaFileNumber: '1234567890',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.false;
    });

    it('should validate missing claimantVaFileNumber field', () => {
      const validData = {
        claimantSsn: '987654321',
      };
      const result = claimantIdentificationInfoSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject multiple invalid fields', () => {
      const invalidData = {
        claimantSsn: '123',
        claimantVaFileNumber: 'ABC',
      };
      const result = claimantIdentificationInfoSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
