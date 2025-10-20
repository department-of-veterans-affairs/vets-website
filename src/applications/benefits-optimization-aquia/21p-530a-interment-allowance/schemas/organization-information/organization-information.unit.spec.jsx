/**
 * Unit tests for organization information schemas
 */

import { expect } from 'chai';
import {
  organizationNameSchema,
  recipientAddressSchema,
  recipientNameSchema,
  recipientPhoneSchema,
} from './organization-information';

describe('Organization Information Schemas', () => {
  describe('organizationNameSchema', () => {
    it('should validate a valid organization name', () => {
      const result = organizationNameSchema.safeParse(
        'Jedi Temple Memorial Services',
      );
      expect(result.success).to.be.true;
    });

    it('should require organization name', () => {
      const result = organizationNameSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('required');
      }
    });

    it('should reject names over 100 characters', () => {
      const longName = 'a'.repeat(101);
      const result = organizationNameSchema.safeParse(longName);
      expect(result.success).to.be.false;
    });
  });

  describe('recipientNameSchema', () => {
    it('should validate a valid recipient name', () => {
      const result = recipientNameSchema.safeParse('Obi-Wan Kenobi');
      expect(result.success).to.be.true;
    });

    it('should require recipient name', () => {
      const result = recipientNameSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject names over 100 characters', () => {
      const longName = 'a'.repeat(101);
      const result = recipientNameSchema.safeParse(longName);
      expect(result.success).to.be.false;
    });
  });

  describe('recipientPhoneSchema', () => {
    it('should validate a valid phone number', () => {
      const result = recipientPhoneSchema.safeParse('5551234567');
      expect(result.success).to.be.true;
    });

    it('should require phone number', () => {
      const result = recipientPhoneSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject phone numbers with special characters', () => {
      const result = recipientPhoneSchema.safeParse('555-123-4567');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('10 digits');
      }
    });

    it('should reject phone numbers not 10 digits', () => {
      const result = recipientPhoneSchema.safeParse('123456789');
      expect(result.success).to.be.false;
    });
  });

  describe('recipientAddressSchema', () => {
    it('should validate a valid address', () => {
      const validAddress = {
        street: '1138 Temple Way',
        city: 'Coruscant City',
        state: 'DC',
        country: 'USA',
        postalCode: '20001',
      };
      const result = recipientAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should validate address with optional fields', () => {
      const validAddress = {
        street: '1138 Temple Way',
        street2: 'High Council Chambers',
        street3: 'Building C',
        city: 'Coruscant City',
        state: 'DC',
        country: 'USA',
        postalCode: '20001',
        isMilitary: false,
      };
      const result = recipientAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should accept extended ZIP code format', () => {
      const validAddress = {
        street: '1138 Temple Way',
        city: 'Coruscant City',
        state: 'DC',
        country: 'USA',
        postalCode: '20001-1234',
      };
      const result = recipientAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should require street address', () => {
      const invalidAddress = {
        street: '',
        city: 'Coruscant City',
        state: 'DC',
        country: 'USA',
        postalCode: '20001',
      };
      const result = recipientAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should require city', () => {
      const invalidAddress = {
        street: '1138 Temple Way',
        city: '',
        state: 'DC',
        country: 'USA',
        postalCode: '20001',
      };
      const result = recipientAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should require state as 2-letter code', () => {
      const invalidAddress = {
        street: '1138 Temple Way',
        city: 'Coruscant City',
        state: 'District of Columbia',
        country: 'USA',
        postalCode: '20001',
      };
      const result = recipientAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should reject invalid postal code format', () => {
      const invalidAddress = {
        street: '1138 Temple Way',
        city: 'Coruscant City',
        state: 'DC',
        country: 'USA',
        postalCode: '123',
      };
      const result = recipientAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('12345');
      }
    });
  });
});
