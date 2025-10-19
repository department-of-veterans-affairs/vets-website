/**
 * Unit tests for burial information schemas
 */

import { expect } from 'chai';
import {
  cemeteryLocationSchema,
  cemeteryNameSchema,
  dateOfBurialSchema,
} from './burial-information';

describe('Burial Information Schemas', () => {
  describe('dateOfBurialSchema', () => {
    it('should validate a valid date', () => {
      const result = dateOfBurialSchema.safeParse('2023-10-15');
      expect(result.success).to.be.true;
    });

    it('should require a date', () => {
      const result = dateOfBurialSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('required');
      }
    });

    it('should reject invalid dates', () => {
      const result = dateOfBurialSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
    });
  });

  describe('cemeteryNameSchema', () => {
    it('should validate a valid cemetery name', () => {
      const result = cemeteryNameSchema.safeParse(
        'Arlington National Cemetery',
      );
      expect(result.success).to.be.true;
    });

    it('should require cemetery name', () => {
      const result = cemeteryNameSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('required');
      }
    });

    it('should reject names over 100 characters', () => {
      const longName = 'a'.repeat(101);
      const result = cemeteryNameSchema.safeParse(longName);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('100 characters');
      }
    });
  });

  describe('cemeteryLocationSchema', () => {
    it('should validate a valid location', () => {
      const validLocation = {
        city: 'Arlington',
        state: 'VA',
      };
      const result = cemeteryLocationSchema.safeParse(validLocation);
      expect(result.success).to.be.true;
    });

    it('should require city', () => {
      const invalidLocation = {
        city: '',
        state: 'VA',
      };
      const result = cemeteryLocationSchema.safeParse(invalidLocation);
      expect(result.success).to.be.false;
    });

    it('should require state', () => {
      const invalidLocation = {
        city: 'Arlington',
        state: '',
      };
      const result = cemeteryLocationSchema.safeParse(invalidLocation);
      expect(result.success).to.be.false;
    });

    it('should require 2-letter state code', () => {
      const invalidLocation = {
        city: 'Arlington',
        state: 'Virginia',
      };
      const result = cemeteryLocationSchema.safeParse(invalidLocation);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include('2-letter');
      }
    });

    it('should reject city over 50 characters', () => {
      const invalidLocation = {
        city: 'a'.repeat(51),
        state: 'VA',
      };
      const result = cemeteryLocationSchema.safeParse(invalidLocation);
      expect(result.success).to.be.false;
    });
  });
});
