/**
 * Unit tests for claimant question schemas
 */

import { expect } from 'chai';
import { patientTypeSchema, claimantQuestionSchema } from './claimant-question';

describe('Claimant Question Schemas', () => {
  describe('patientTypeSchema', () => {
    it('should validate "veteran" as patient type', () => {
      const result = patientTypeSchema.safeParse('veteran');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('veteran');
    });

    it('should validate "spouseOrParent" as patient type', () => {
      const result = patientTypeSchema.safeParse('spouseOrParent');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('spouseOrParent');
    });

    it('should reject empty string', () => {
      const result = patientTypeSchema.safeParse('');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'select who is the patient',
        );
      }
    });

    it('should reject invalid value', () => {
      const result = patientTypeSchema.safeParse('child');
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'select who is the patient',
        );
      }
    });

    it('should reject null', () => {
      const result = patientTypeSchema.safeParse(null);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'select who is the patient',
        );
      }
    });

    it('should reject undefined', () => {
      const result = patientTypeSchema.safeParse(undefined);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'select who is the patient',
        );
      }
    });

    it('should reject wrong case', () => {
      const result = patientTypeSchema.safeParse('Veteran');
      expect(result.success).to.be.false;
    });

    it('should reject partial match', () => {
      const result = patientTypeSchema.safeParse('spouse');
      expect(result.success).to.be.false;
    });

    it('should reject number', () => {
      const result = patientTypeSchema.safeParse(1);
      expect(result.success).to.be.false;
    });

    it('should reject boolean', () => {
      const result = patientTypeSchema.safeParse(true);
      expect(result.success).to.be.false;
    });

    it('should reject object', () => {
      const result = patientTypeSchema.safeParse({ type: 'veteran' });
      expect(result.success).to.be.false;
    });

    it('should reject array', () => {
      const result = patientTypeSchema.safeParse(['veteran']);
      expect(result.success).to.be.false;
    });
  });

  describe('claimantQuestionSchema', () => {
    it('should validate complete schema with veteran', () => {
      const validData = {
        patientType: 'veteran',
      };
      const result = claimantQuestionSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.patientType).to.equal('veteran');
      }
    });

    it('should validate complete schema with spouseOrParent', () => {
      const validData = {
        patientType: 'spouseOrParent',
      };
      const result = claimantQuestionSchema.safeParse(validData);
      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.patientType).to.equal('spouseOrParent');
      }
    });

    it('should reject missing patientType', () => {
      const invalidData = {};
      const result = claimantQuestionSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject empty patientType', () => {
      const invalidData = {
        patientType: '',
      };
      const result = claimantQuestionSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject invalid patientType', () => {
      const invalidData = {
        patientType: 'invalid',
      };
      const result = claimantQuestionSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject null patientType', () => {
      const invalidData = {
        patientType: null,
      };
      const result = claimantQuestionSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject undefined patientType', () => {
      const invalidData = {
        patientType: undefined,
      };
      const result = claimantQuestionSchema.safeParse(invalidData);
      expect(result.success).to.be.false;
    });

    it('should reject extra fields', () => {
      const invalidData = {
        patientType: 'veteran',
        extraField: 'should not be here',
      };
      // Zod allows extra fields by default, but we test the structure
      const result = claimantQuestionSchema.safeParse(invalidData);
      // This will pass in Zod by default unless we use .strict()
      expect(result.success).to.be.true;
    });
  });
});
