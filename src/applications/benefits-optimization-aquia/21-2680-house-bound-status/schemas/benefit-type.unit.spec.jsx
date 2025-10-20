/**
 * @module tests/schemas/benefit-type.unit.spec
 * @description Unit tests for benefit type schemas
 */

import { expect } from 'chai';
import { BENEFIT_TYPES } from '@bio-aquia/21-2680-house-bound-status/constants';
import { benefitTypeSchema, benefitTypePageSchema } from './benefit-type';

describe('Benefit Type Schemas', () => {
  describe('benefitTypeSchema', () => {
    it('should validate SMC benefit type', () => {
      const result = benefitTypeSchema.safeParse(BENEFIT_TYPES.SMC);
      expect(result.success).to.be.true;
      expect(result.data).to.equal('smc');
    });

    it('should validate SMP benefit type', () => {
      const result = benefitTypeSchema.safeParse(BENEFIT_TYPES.SMP);
      expect(result.success).to.be.true;
      expect(result.data).to.equal('smp');
    });

    it('should reject invalid benefit type', () => {
      const result = benefitTypeSchema.safeParse('invalid');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Please select a benefit type',
      );
    });

    it('should reject empty string', () => {
      const result = benefitTypeSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject null', () => {
      const result = benefitTypeSchema.safeParse(null);
      expect(result.success).to.be.false;
    });

    it('should reject undefined', () => {
      const result = benefitTypeSchema.safeParse(undefined);
      expect(result.success).to.be.false;
    });
  });

  describe('benefitTypePageSchema', () => {
    it('should validate complete page schema with SMC', () => {
      const data = { benefitType: BENEFIT_TYPES.SMC };
      const result = benefitTypePageSchema.safeParse(data);
      expect(result.success).to.be.true;
      expect(result.data.benefitType).to.equal('smc');
    });

    it('should validate complete page schema with SMP', () => {
      const data = { benefitType: BENEFIT_TYPES.SMP };
      const result = benefitTypePageSchema.safeParse(data);
      expect(result.success).to.be.true;
      expect(result.data.benefitType).to.equal('smp');
    });

    it('should reject page schema with invalid benefit type', () => {
      const data = { benefitType: 'invalid' };
      const result = benefitTypePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject page schema without benefitType', () => {
      const data = {};
      const result = benefitTypePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });
});
