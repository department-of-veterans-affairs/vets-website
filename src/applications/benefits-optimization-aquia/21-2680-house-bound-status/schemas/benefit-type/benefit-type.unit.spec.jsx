/**
 * @module tests/schemas/benefit-type.unit.spec
 * @description Unit tests for benefit type validation schemas
 */

import { expect } from 'chai';
import { BENEFIT_TYPES } from '@bio-aquia/21-2680-house-bound-status/constants';
import { benefitTypeSchema, benefitTypePageSchema } from './benefit-type';

describe('Benefit Type Validation Schemas', () => {
  describe('benefitTypeSchema', () => {
    it('should validate SMC benefit type', () => {
      const result = benefitTypeSchema.safeParse(BENEFIT_TYPES.SMC);
      expect(result.success).to.be.true;
    });

    it('should validate SMP benefit type', () => {
      const result = benefitTypeSchema.safeParse(BENEFIT_TYPES.SMP);
      expect(result.success).to.be.true;
    });

    it('should reject invalid benefit type', () => {
      const result = benefitTypeSchema.safeParse('invalid');
      expect(result.success).to.be.false;
    });

    it('should reject empty benefit type', () => {
      const result = benefitTypeSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should have custom error message', () => {
      const result = benefitTypeSchema.safeParse('invalid');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'Please select a benefit type',
        );
      }
    });
  });

  describe('benefitTypePageSchema', () => {
    it('should validate page with SMC benefit type', () => {
      const data = { benefitType: BENEFIT_TYPES.SMC };
      const result = benefitTypePageSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate page with SMP benefit type', () => {
      const data = { benefitType: BENEFIT_TYPES.SMP };
      const result = benefitTypePageSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject page with invalid benefit type', () => {
      const data = { benefitType: 'invalid' };
      const result = benefitTypePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject page with missing benefit type', () => {
      const data = {};
      const result = benefitTypePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });
});
