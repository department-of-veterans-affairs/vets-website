/**
 * @module tests/schemas/signatures.unit.spec
 * @description Unit tests for signature validation schemas
 */

import { expect } from 'chai';
import {
  claimantSignaturePageSchema,
  examinerSignaturePageSchema,
} from './signatures';

describe('Signature Schemas', () => {
  describe('claimantSignaturePageSchema', () => {
    it('should validate complete claimant signature', () => {
      const data = {
        claimantSignature: 'Boba Fett',
        claimantSignatureDate: '2024-10-20',
      };
      const result = claimantSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject missing signature', () => {
      const data = {
        claimantSignatureDate: '2024-10-20',
      };
      const result = claimantSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing date', () => {
      const data = {
        claimantSignature: 'Boba Fett',
      };
      const result = claimantSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });

  describe('examinerSignaturePageSchema', () => {
    it('should validate complete examiner signature', () => {
      const data = {
        examinationDate: '2024-10-15',
        examinerSignature: 'Dr. Beverly Crusher',
        examinerSignatureDate: '2024-10-20',
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should reject missing examination date', () => {
      const data = {
        examinerSignature: 'Dr. Beverly Crusher',
        examinerSignatureDate: '2024-10-20',
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing examiner signature', () => {
      const data = {
        examinationDate: '2024-10-15',
        examinerSignatureDate: '2024-10-20',
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });
});
