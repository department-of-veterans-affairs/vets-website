/**
 * @module tests/schemas/signatures.unit.spec
 * @description Unit tests for signature validation schemas
 */

import { expect } from 'chai';
import {
  claimantSignatureSchema,
  claimantSignatureDateSchema,
  examinationDateSchema,
  examinerSignatureSchema,
  examinerSignatureDateSchema,
  claimantSignaturePageSchema,
  examinerSignaturePageSchema,
} from './signatures';

describe('Signature Schemas', () => {
  describe('claimantSignatureSchema', () => {
    it('should validate valid signature', () => {
      const result = claimantSignatureSchema.safeParse('Boba Fett');
      expect(result.success).to.be.true;
    });

    it('should validate signature at max length', () => {
      const result = claimantSignatureSchema.safeParse('A'.repeat(50));
      expect(result.success).to.be.true;
    });

    it('should reject empty signature', () => {
      const result = claimantSignatureSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('Signature is required');
    });

    it('should reject signature over 50 characters', () => {
      const result = claimantSignatureSchema.safeParse('A'.repeat(51));
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'less than 50 characters',
      );
    });

    it('should validate signature with spaces', () => {
      const result = claimantSignatureSchema.safeParse('John Doe Jr.');
      expect(result.success).to.be.true;
    });

    it('should validate signature with special characters', () => {
      const result = claimantSignatureSchema.safeParse("O'Brien-Smith");
      expect(result.success).to.be.true;
    });
  });

  describe('claimantSignatureDateSchema', () => {
    it('should validate valid date', () => {
      const result = claimantSignatureDateSchema.safeParse('2024-10-20');
      expect(result.success).to.be.true;
    });

    it('should validate today as date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = claimantSignatureDateSchema.safeParse(today);
      expect(result.success).to.be.true;
    });

    it('should validate past date', () => {
      const result = claimantSignatureDateSchema.safeParse('2020-01-01');
      expect(result.success).to.be.true;
    });

    it('should reject empty date', () => {
      const result = claimantSignatureDateSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('Date is required');
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = claimantSignatureDateSchema.safeParse(
        futureDate.toISOString().split('T')[0],
      );
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'cannot be in the future',
      );
    });

    it('should reject invalid date string', () => {
      const result = claimantSignatureDateSchema.safeParse('invalid-date');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include('valid date');
    });

    it('should reject invalid date format', () => {
      const result = claimantSignatureDateSchema.safeParse('13/45/2023');
      expect(result.success).to.be.false;
    });
  });

  describe('examinationDateSchema', () => {
    it('should validate valid examination date', () => {
      const result = examinationDateSchema.safeParse('2024-10-15');
      expect(result.success).to.be.true;
    });

    it('should validate today as examination date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = examinationDateSchema.safeParse(today);
      expect(result.success).to.be.true;
    });

    it('should validate past examination date', () => {
      const result = examinationDateSchema.safeParse('2023-06-15');
      expect(result.success).to.be.true;
    });

    it('should reject empty examination date', () => {
      const result = examinationDateSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal(
        'Examination date is required',
      );
    });

    it('should reject future examination date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = examinationDateSchema.safeParse(
        futureDate.toISOString().split('T')[0],
      );
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'cannot be in the future',
      );
    });

    it('should reject invalid examination date string', () => {
      const result = examinationDateSchema.safeParse('not-a-date');
      expect(result.success).to.be.false;
    });
  });

  describe('examinerSignatureSchema', () => {
    it('should validate valid examiner signature', () => {
      const result = examinerSignatureSchema.safeParse('Dr. Beverly Crusher');
      expect(result.success).to.be.true;
    });

    it('should validate signature at max length', () => {
      const result = examinerSignatureSchema.safeParse('A'.repeat(50));
      expect(result.success).to.be.true;
    });

    it('should reject empty examiner signature', () => {
      const result = examinerSignatureSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('Signature is required');
    });

    it('should reject signature over 50 characters', () => {
      const result = examinerSignatureSchema.safeParse('A'.repeat(51));
      expect(result.success).to.be.false;
    });

    it('should validate examiner signature with credentials', () => {
      const result = examinerSignatureSchema.safeParse('John Smith, MD');
      expect(result.success).to.be.true;
    });
  });

  describe('examinerSignatureDateSchema', () => {
    it('should validate valid signature date', () => {
      const result = examinerSignatureDateSchema.safeParse('2024-10-20');
      expect(result.success).to.be.true;
    });

    it('should validate today as signature date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = examinerSignatureDateSchema.safeParse(today);
      expect(result.success).to.be.true;
    });

    it('should validate past signature date', () => {
      const result = examinerSignatureDateSchema.safeParse('2023-12-15');
      expect(result.success).to.be.true;
    });

    it('should reject empty signature date', () => {
      const result = examinerSignatureDateSchema.safeParse('');
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.equal('Date is required');
    });

    it('should reject future signature date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = examinerSignatureDateSchema.safeParse(
        futureDate.toISOString().split('T')[0],
      );
      expect(result.success).to.be.false;
      expect(result.error.errors[0].message).to.include(
        'cannot be in the future',
      );
    });

    it('should reject invalid signature date', () => {
      const result = examinerSignatureDateSchema.safeParse('invalid');
      expect(result.success).to.be.false;
    });
  });

  describe('claimantSignaturePageSchema', () => {
    it('should validate complete claimant signature', () => {
      const data = {
        claimantSignature: 'Boba Fett',
        claimantSignatureDate: '2024-10-20',
      };
      const result = claimantSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate with today date', () => {
      const today = new Date().toISOString().split('T')[0];
      const data = {
        claimantSignature: 'Jango Fett',
        claimantSignatureDate: today,
      };
      const result = claimantSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate with past date', () => {
      const data = {
        claimantSignature: 'Cad Bane',
        claimantSignatureDate: '2023-06-15',
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

    it('should reject empty signature', () => {
      const data = {
        claimantSignature: '',
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

    it('should reject empty date', () => {
      const data = {
        claimantSignature: 'Boba Fett',
        claimantSignatureDate: '',
      };
      const result = claimantSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const data = {
        claimantSignature: 'Boba Fett',
        claimantSignatureDate: futureDate.toISOString().split('T')[0],
      };
      const result = claimantSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject signature over max length', () => {
      const data = {
        claimantSignature: 'A'.repeat(51),
        claimantSignatureDate: '2024-10-20',
      };
      const result = claimantSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid date format', () => {
      const data = {
        claimantSignature: 'Boba Fett',
        claimantSignatureDate: 'invalid-date',
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

    it('should validate with all today dates', () => {
      const today = new Date().toISOString().split('T')[0];
      const data = {
        examinationDate: today,
        examinerSignature: 'Dr. Leonard McCoy',
        examinerSignatureDate: today,
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.true;
    });

    it('should validate with past dates', () => {
      const data = {
        examinationDate: '2023-06-10',
        examinerSignature: 'Dr. Julian Bashir',
        examinerSignatureDate: '2023-06-15',
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

    it('should reject empty examination date', () => {
      const data = {
        examinationDate: '',
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

    it('should reject empty examiner signature', () => {
      const data = {
        examinationDate: '2024-10-15',
        examinerSignature: '',
        examinerSignatureDate: '2024-10-20',
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject missing signature date', () => {
      const data = {
        examinationDate: '2024-10-15',
        examinerSignature: 'Dr. Beverly Crusher',
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject empty signature date', () => {
      const data = {
        examinationDate: '2024-10-15',
        examinerSignature: 'Dr. Beverly Crusher',
        examinerSignatureDate: '',
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject future examination date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const data = {
        examinationDate: futureDate.toISOString().split('T')[0],
        examinerSignature: 'Dr. Beverly Crusher',
        examinerSignatureDate: '2024-10-20',
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject future signature date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const data = {
        examinationDate: '2024-10-15',
        examinerSignature: 'Dr. Beverly Crusher',
        examinerSignatureDate: futureDate.toISOString().split('T')[0],
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject signature over max length', () => {
      const data = {
        examinationDate: '2024-10-15',
        examinerSignature: 'A'.repeat(51),
        examinerSignatureDate: '2024-10-20',
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid examination date', () => {
      const data = {
        examinationDate: 'invalid',
        examinerSignature: 'Dr. Beverly Crusher',
        examinerSignatureDate: '2024-10-20',
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });

    it('should reject invalid signature date', () => {
      const data = {
        examinationDate: '2024-10-15',
        examinerSignature: 'Dr. Beverly Crusher',
        examinerSignatureDate: 'not-a-date',
      };
      const result = examinerSignaturePageSchema.safeParse(data);
      expect(result.success).to.be.false;
    });
  });
});
