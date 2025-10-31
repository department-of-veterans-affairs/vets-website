/**
 * @module tests/schemas/employment-concessions.unit.spec
 * @description Unit tests for employment concessions validation schemas
 */

import { expect } from 'chai';
import {
  concessionsSchema,
  employmentConcessionsSchema,
} from './employment-concessions';

describe('Employment Concessions Schemas', () => {
  describe('concessionsSchema', () => {
    it('should validate empty string', () => {
      expect(concessionsSchema.safeParse('').success).to.be.true;
    });

    it('should validate concessions text', () => {
      expect(concessionsSchema.safeParse('Modified duty schedule').success).to
        .be.true;
    });

    it('should validate 1000 character string', () => {
      expect(concessionsSchema.safeParse('A'.repeat(1000)).success).to.be.true;
    });

    it('should reject over 1000 characters', () => {
      expect(concessionsSchema.safeParse('A'.repeat(1001)).success).to.be.false;
    });
  });

  describe('employmentConcessionsSchema', () => {
    it('should validate complete schema', () => {
      expect(
        employmentConcessionsSchema.safeParse({
          concessions: 'Modified schedule',
        }).success,
      ).to.be.true;
    });

    it('should validate empty concessions', () => {
      expect(employmentConcessionsSchema.safeParse({ concessions: '' }).success)
        .to.be.true;
    });
  });
});
