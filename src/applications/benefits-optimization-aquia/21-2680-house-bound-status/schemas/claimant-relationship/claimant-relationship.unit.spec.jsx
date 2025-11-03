/**
 * Unit tests for claimant relationship schemas
 */

import { expect } from 'chai';
import {
  claimantRelationshipSchema,
  claimantRelationshipPageSchema,
} from './claimant-relationship';

describe('Claimant Relationship Schemas', () => {
  describe('claimantRelationshipSchema', () => {
    it('should validate veteran relationship', () => {
      const result = claimantRelationshipSchema.safeParse('veteran');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('veteran');
    });

    it('should validate spouse relationship', () => {
      const result = claimantRelationshipSchema.safeParse('spouse');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('spouse');
    });

    it('should validate child relationship', () => {
      const result = claimantRelationshipSchema.safeParse('child');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('child');
    });

    it('should validate parent relationship', () => {
      const result = claimantRelationshipSchema.safeParse('parent');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('parent');
    });

    it('should reject invalid relationship', () => {
      const result = claimantRelationshipSchema.safeParse('friend');
      expect(result.success).to.be.false;
    });

    it('should reject empty string', () => {
      const result = claimantRelationshipSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'who the claim is for',
        );
      }
    });

    it('should reject undefined', () => {
      const result = claimantRelationshipSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should reject null', () => {
      const result = claimantRelationshipSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject numeric values', () => {
      const result = claimantRelationshipSchema.safeParse(123);
      expect(result.success).to.be.false;
    });

    it('should reject boolean values', () => {
      const result = claimantRelationshipSchema.safeParse(true);
      expect(result.success).to.be.false;
    });

    it('should be case sensitive', () => {
      const result = claimantRelationshipSchema.safeParse('VETERAN');
      expect(result.success).to.be.false;
    });
  });

  describe('claimantRelationshipPageSchema', () => {
    it('should validate complete page data with veteran', () => {
      const validData = {
        relationship: 'veteran',
      };
      const result = claimantRelationshipPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate complete page data with spouse', () => {
      const validData = {
        relationship: 'spouse',
      };
      const result = claimantRelationshipPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate complete page data with child', () => {
      const validData = {
        relationship: 'child',
      };
      const result = claimantRelationshipPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should validate complete page data with parent', () => {
      const validData = {
        relationship: 'parent',
      };
      const result = claimantRelationshipPageSchema.safeParse(validData);
      expect(result.success).to.be.true;
    });

    it('should reject missing relationship', () => {
      const invalidData = {};
      const result = claimantRelationshipPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid relationship value', () => {
      const invalidData = {
        relationship: 'invalid',
      };
      const result = claimantRelationshipPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty string relationship', () => {
      const invalidData = {
        relationship: '',
      };
      const result = claimantRelationshipPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null relationship', () => {
      const invalidData = {
        relationship: null,
      };
      const result = claimantRelationshipPageSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });
  });
});
