/**
 * Unit tests for veteran address schemas
 */

import { expect } from 'chai';
import {
  veteranAddressSchema,
  veteranAddressPageSchema,
} from './veteran-address';

describe('Veteran Address Schemas', () => {
  describe('veteranAddressSchema', () => {
    it('should validate complete address', () => {
      const validAddress = {
        street: '123 Main Street',
        street2: 'Apt 4B',
        street3: 'Building C',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
        isMilitary: false,
      };
      const result = veteranAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should validate address without optional street2 and street3', () => {
      const validAddress = {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should validate address with 9-digit ZIP code', () => {
      const validAddress = {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102-1234',
      };
      const result = veteranAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should validate military address', () => {
      const validAddress = {
        street: 'Unit 1234 Box 5678',
        city: 'APO',
        state: 'AE',
        country: 'USA',
        postalCode: '09123',
        isMilitary: true,
      };
      const result = veteranAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should reject missing street', () => {
      const invalidAddress = {
        street: '',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Street address is required',
        );
      }
    });

    it('should reject street over 50 characters', () => {
      const invalidAddress = {
        street: 'A'.repeat(51),
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'less than 50 characters',
        );
      }
    });

    it('should validate street at max length', () => {
      const validAddress = {
        street: 'A'.repeat(50),
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should reject street2 over 50 characters', () => {
      const invalidAddress = {
        street: '123 Main St',
        street2: 'A'.repeat(51),
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should reject street3 over 50 characters', () => {
      const invalidAddress = {
        street: '123 Main St',
        street3: 'A'.repeat(51),
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should reject missing city', () => {
      const invalidAddress = {
        street: '123 Main Street',
        city: '',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('City is required');
      }
    });

    it('should reject city over 50 characters', () => {
      const invalidAddress = {
        street: '123 Main Street',
        city: 'A'.repeat(51),
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should validate city at max length', () => {
      const validAddress = {
        street: '123 Main Street',
        city: 'A'.repeat(50),
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should reject missing state', () => {
      const invalidAddress = {
        street: '123 Main Street',
        city: 'San Francisco',
        state: '',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('State is required');
      }
    });

    it('should reject state not 2 characters', () => {
      const invalidAddress = {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('2-letter code');
      }
    });

    it('should validate various state codes', () => {
      const states = ['CA', 'NY', 'TX', 'FL', 'AE', 'AP', 'AA'];
      states.forEach(state => {
        const validAddress = {
          street: '123 Main Street',
          city: 'City',
          state,
          country: 'USA',
          postalCode: '94102',
        };
        const result = veteranAddressSchema.safeParse(validAddress);
        expect(result.success).to.be.true;
      });
    });

    it('should reject missing country', () => {
      const invalidAddress = {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: '',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Country is required',
        );
      }
    });

    it('should reject missing postal code', () => {
      const invalidAddress = {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Postal code is required',
        );
      }
    });

    it('should reject invalid postal code format', () => {
      const invalidAddress = {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '123',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          '12345 or 12345-6789',
        );
      }
    });

    it('should reject postal code with letters', () => {
      const invalidAddress = {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: 'ABCDE',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should reject 9-digit ZIP with wrong format', () => {
      const invalidAddress = {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '941021234',
      };
      const result = veteranAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should validate address without isMilitary field', () => {
      const validAddress = {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      };
      const result = veteranAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });
  });

  describe('veteranAddressPageSchema', () => {
    it('should validate complete page data', () => {
      const validData = {
        veteranAddress: {
          street: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = veteranAddressPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing veteranAddress', () => {
      const invalidData = {};
      const result = veteranAddressPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid veteranAddress', () => {
      const invalidData = {
        veteranAddress: {
          street: '',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
        },
      };
      const result = veteranAddressPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
