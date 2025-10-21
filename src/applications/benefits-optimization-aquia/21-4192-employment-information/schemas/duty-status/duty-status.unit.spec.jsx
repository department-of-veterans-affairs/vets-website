/**
 * @module tests/schemas/duty-status.unit.spec
 * @description Unit tests for duty status validation schemas
 */

import { expect } from 'chai';
import { dutyStatusSchema, reserveOrGuardStatusSchema } from './duty-status';

describe('Duty Status Schemas', () => {
  describe('reserveOrGuardStatusSchema', () => {
    describe('Valid Values', () => {
      it('should validate yes', () => {
        const result = reserveOrGuardStatusSchema.safeParse('yes');
        expect(result.success).to.be.true;
      });

      it('should validate no', () => {
        const result = reserveOrGuardStatusSchema.safeParse('no');
        expect(result.success).to.be.true;
      });

      it('should validate empty string', () => {
        const result = reserveOrGuardStatusSchema.safeParse('');
        expect(result.success).to.be.true;
      });

      it('should validate undefined', () => {
        const result = reserveOrGuardStatusSchema.safeParse(undefined);
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Values', () => {
      it('should reject invalid string', () => {
        const result = reserveOrGuardStatusSchema.safeParse('maybe');
        expect(result.success).to.be.false;
      });

      it('should reject number', () => {
        const result = reserveOrGuardStatusSchema.safeParse(1);
        expect(result.success).to.be.false;
      });

      it('should reject boolean', () => {
        const result = reserveOrGuardStatusSchema.safeParse(true);
        expect(result.success).to.be.false;
      });

      it('should reject null', () => {
        const result = reserveOrGuardStatusSchema.safeParse(null);
        expect(result.success).to.be.false;
      });
    });
  });

  describe('dutyStatusSchema', () => {
    describe('Valid Duty Status', () => {
      it('should validate with yes status', () => {
        const result = dutyStatusSchema.safeParse({
          reserveOrGuardStatus: 'yes',
        });
        expect(result.success).to.be.true;
      });

      it('should validate with no status', () => {
        const result = dutyStatusSchema.safeParse({
          reserveOrGuardStatus: 'no',
        });
        expect(result.success).to.be.true;
      });

      it('should validate with empty status', () => {
        const result = dutyStatusSchema.safeParse({
          reserveOrGuardStatus: '',
        });
        expect(result.success).to.be.true;
      });

      it('should validate without status field', () => {
        const result = dutyStatusSchema.safeParse({});
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Duty Status', () => {
      it('should reject invalid status value', () => {
        const result = dutyStatusSchema.safeParse({
          reserveOrGuardStatus: 'invalid',
        });
        expect(result.success).to.be.false;
      });
    });
  });
});
