/**
 * Unit tests for claimant address schemas
 */

import { expect } from 'chai';
import {
  claimantAddressSchema,
  claimantAddressPageSchema,
} from './claimant-address';

describe('Claimant Address Schemas', () => {
  describe('claimantAddressSchema', () => {
    it('should validate complete address', () => {
      const validAddress = {
        street: '456 Spaceport Way',
        street2: 'Suite 200',
        street3: 'Floor 3',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
        isMilitary: false,
      };
      const result = claimantAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should validate address without optional street2 and street3', () => {
      const validAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should validate address with 9-digit ZIP code', () => {
      const validAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001-1234',
      };
      const result = claimantAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should validate military address', () => {
      const validAddress = {
        street: 'PSC 1234 Box 5678',
        city: 'APO',
        state: 'AE',
        country: 'USA',
        postalCode: '09123',
        isMilitary: true,
      };
      const result = claimantAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should reject missing street', () => {
      const invalidAddress = {
        street: '',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
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
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
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
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should reject street2 over 50 characters', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        street2: 'A'.repeat(51),
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should reject street3 over 50 characters', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        street3: 'A'.repeat(51),
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should reject missing city', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        city: '',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('City is required');
      }
    });

    it('should reject city over 50 characters', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        city: 'A'.repeat(51),
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should validate city at max length', () => {
      const validAddress = {
        street: '456 Spaceport Way',
        city: 'A'.repeat(50),
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should reject missing state', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: '',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('State is required');
      }
    });

    it('should reject state not 2 characters', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: 'California',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('2-letter code');
      }
    });

    it('should validate various state codes', () => {
      const states = ['CA', 'NY', 'TX', 'FL', 'AE', 'AP', 'AA'];
      states.forEach(state => {
        const validAddress = {
          street: '456 Spaceport Way',
          city: 'City',
          state,
          country: 'USA',
          postalCode: '90001',
        };
        const result = claimantAddressSchema.safeParse(validAddress);
        expect(result.success).to.be.true;
      });
    });

    it('should reject missing country', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: 'CA',
        country: '',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Country is required',
        );
      }
    });

    it('should reject missing postal code', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Postal code is required',
        );
      }
    });

    it('should reject invalid postal code format', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '123',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          '12345 or 12345-6789',
        );
      }
    });

    it('should reject postal code with letters', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: 'ABCDE',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should reject 9-digit ZIP with wrong format', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '900011234',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });

    it('should validate address without isMilitary field', () => {
      const validAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should validate address with street2 only', () => {
      const validAddress = {
        street: '456 Spaceport Way',
        street2: 'Suite 200',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should validate address with street3 only', () => {
      const validAddress = {
        street: '456 Spaceport Way',
        street3: 'Building B',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      };
      const result = claimantAddressSchema.safeParse(validAddress);
      expect(result.success).to.be.true;
    });

    it('should reject invalid postal code with special characters', () => {
      const invalidAddress = {
        street: '456 Spaceport Way',
        city: 'Mos Eisley',
        state: 'CA',
        country: 'USA',
        postalCode: '90001@1234',
      };
      const result = claimantAddressSchema.safeParse(invalidAddress);
      expect(result.success).to.be.false;
    });
  });

  describe('claimantAddressPageSchema', () => {
    it('should validate complete page data', () => {
      const validData = {
        claimantAddress: {
          street: '456 Spaceport Way',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '90001',
        },
      };
      const result = claimantAddressPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing claimantAddress', () => {
      const invalidData = {};
      const result = claimantAddressPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid claimantAddress', () => {
      const invalidData = {
        claimantAddress: {
          street: '',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '90001',
        },
      };
      const result = claimantAddressPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should validate page data with complete address including optional fields', () => {
      const validData = {
        claimantAddress: {
          street: '456 Spaceport Way',
          street2: 'Suite 200',
          street3: 'Floor 3',
          city: 'Mos Eisley',
          state: 'CA',
          country: 'USA',
          postalCode: '90001-1234',
          isMilitary: false,
        },
      };
      const result = claimantAddressPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });
  });
});
