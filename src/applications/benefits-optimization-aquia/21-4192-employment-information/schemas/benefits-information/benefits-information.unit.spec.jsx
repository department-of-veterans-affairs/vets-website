/**
 * @module tests/schemas/benefits-information.unit.spec
 * @description Unit tests for benefits information validation schemas
 */

import { expect } from 'chai';
import {
  benefitEntitlementSchema,
  benefitsInformationSchema,
} from './benefits-information';

describe('Benefits Information Schemas', () => {
  describe('benefitEntitlementSchema', () => {
    describe('Valid Values', () => {
      it('should validate yes', () => {
        const result = benefitEntitlementSchema.safeParse('yes');
        expect(result.success).to.be.true;
      });

      it('should validate no', () => {
        const result = benefitEntitlementSchema.safeParse('no');
        expect(result.success).to.be.true;
      });

      it('should validate empty string', () => {
        const result = benefitEntitlementSchema.safeParse('');
        expect(result.success).to.be.true;
      });

      it('should validate undefined', () => {
        const result = benefitEntitlementSchema.safeParse(undefined);
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Values', () => {
      it('should reject invalid string', () => {
        const result = benefitEntitlementSchema.safeParse('maybe');
        expect(result.success).to.be.false;
      });

      it('should reject null', () => {
        const result = benefitEntitlementSchema.safeParse(null);
        expect(result.success).to.be.false;
      });
    });
  });

  describe('benefitsInformationSchema', () => {
    describe('Valid Benefits Information', () => {
      it('should validate with yes entitlement', () => {
        const result = benefitsInformationSchema.safeParse({
          benefitEntitlement: 'yes',
        });
        expect(result.success).to.be.true;
      });

      it('should validate with no entitlement', () => {
        const result = benefitsInformationSchema.safeParse({
          benefitEntitlement: 'no',
        });
        expect(result.success).to.be.true;
      });

      it('should validate with empty entitlement', () => {
        const result = benefitsInformationSchema.safeParse({
          benefitEntitlement: '',
        });
        expect(result.success).to.be.true;
      });

      it('should validate without entitlement field', () => {
        const result = benefitsInformationSchema.safeParse({});
        expect(result.success).to.be.true;
      });
    });
  });
});
