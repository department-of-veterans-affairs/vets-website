/**
 * @module tests/schemas/relationship-to-veteran.unit.spec
 * @description Unit tests for relationship to veteran schema
 */

import { expect } from 'chai';
import { relationshipToVeteranSchema } from './relationship-to-veteran';

describe('Relationship to Veteran Schema', () => {
  describe('Valid Values', () => {
    it('should validate "state_cemetery"', () => {
      const result = relationshipToVeteranSchema.safeParse('state_cemetery');
      expect(result.success).to.be.true;
    });

    it('should validate "tribal_organization"', () => {
      const result = relationshipToVeteranSchema.safeParse(
        'tribal_organization',
      );
      expect(result.success).to.be.true;
    });
  });

  describe('Invalid Values', () => {
    it('should reject empty string', () => {
      const result = relationshipToVeteranSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject undefined', () => {
      const result = relationshipToVeteranSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });

    it('should reject null', () => {
      const result = relationshipToVeteranSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject invalid string value', () => {
      const result = relationshipToVeteranSchema.safeParse('invalid_value');
      expect(result.success).to.be.false;
    });

    it('should reject numeric value', () => {
      const result = relationshipToVeteranSchema.safeParse(123);
      expect(result.success).to.be.false;
    });

    it('should reject object', () => {
      const result = relationshipToVeteranSchema.safeParse({});
      expect(result.success).to.be.false;
    });

    it('should reject array', () => {
      const result = relationshipToVeteranSchema.safeParse([]);
      expect(result.success).to.be.false;
    });
  });

  describe('Error Messages', () => {
    it('should have custom error message for invalid enum value', () => {
      const result = relationshipToVeteranSchema.safeParse('invalid');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Please select your organization type',
        );
      }
    });

    it('should have custom error message for empty string', () => {
      const result = relationshipToVeteranSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Please select your organization type',
        );
      }
    });

    it('should have custom error message for null', () => {
      const result = relationshipToVeteranSchema.safeParse(null);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Please select your organization type',
        );
      }
    });
  });

  describe('Type Validation', () => {
    it('should only accept string type', () => {
      const validResult = relationshipToVeteranSchema.safeParse(
        'state_cemetery',
      );
      const invalidResult = relationshipToVeteranSchema.safeParse(true);

      expect(validResult.success).to.be.true;
      expect(invalidResult.success).to.be.false;
    });

    it('should not accept boolean', () => {
      const result = relationshipToVeteranSchema.safeParse(false);
      expect(result.success).to.be.false;
    });
  });

  describe('Case Sensitivity', () => {
    it('should be case sensitive for state_cemetery', () => {
      const validResult = relationshipToVeteranSchema.safeParse(
        'state_cemetery',
      );
      const invalidResult = relationshipToVeteranSchema.safeParse(
        'State_Cemetery',
      );

      expect(validResult.success).to.be.true;
      expect(invalidResult.success).to.be.false;
    });

    it('should be case sensitive for tribal_organization', () => {
      const validResult = relationshipToVeteranSchema.safeParse(
        'tribal_organization',
      );
      const invalidResult = relationshipToVeteranSchema.safeParse(
        'Tribal_Organization',
      );

      expect(validResult.success).to.be.true;
      expect(invalidResult.success).to.be.false;
    });
  });
});
