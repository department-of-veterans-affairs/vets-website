/**
 * @module tests/schemas/remarks.unit.spec
 * @description Unit tests for remarks validation schemas
 */

import { expect } from 'chai';
import { remarksFieldSchema, remarksSchema } from './remarks';

describe('Remarks Schemas', () => {
  describe('remarksFieldSchema', () => {
    describe('Valid Remarks', () => {
      it('should validate empty string', () => {
        const result = remarksFieldSchema.safeParse('');
        expect(result.success).to.be.true;
      });

      it('should validate undefined', () => {
        const result = remarksFieldSchema.safeParse(undefined);
        expect(result.success).to.be.true;
      });

      it('should validate short remark', () => {
        const result = remarksFieldSchema.safeParse(
          'Boba Fett performed admirably.',
        );
        expect(result.success).to.be.true;
      });

      it('should validate mission remark', () => {
        const result = remarksFieldSchema.safeParse(
          'Boba Fett was instrumental in the successful completion of the five-year contract across the Outer Rim.',
        );
        expect(result.success).to.be.true;
      });

      it('should validate 2000 character remark', () => {
        const result = remarksFieldSchema.safeParse('A'.repeat(2000));
        expect(result.success).to.be.true;
      });

      it('should validate multiline remark', () => {
        const result = remarksFieldSchema.safeParse(
          'The Code is the Way.\nThis is the way of the Bounty Hunters Guild.',
        );
        expect(result.success).to.be.true;
      });

      it('should validate remark with special characters', () => {
        const result = remarksFieldSchema.safeParse(
          'I take on any job - for the right price. - Cad Bane',
        );
        expect(result.success).to.be.true;
      });

      it('should validate remark with numbers', () => {
        const result = remarksFieldSchema.safeParse(
          'Slave I completed mission on Contract Year 2258',
        );
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Remarks', () => {
      it('should reject remarks over 2000 characters', () => {
        const result = remarksFieldSchema.safeParse('A'.repeat(2001));
        expect(result.success).to.be.false;
        if (!result.success) {
          expect(result.error.issues[0].message).to.include(
            'less than 2000 characters',
          );
        }
      });

      it('should reject extremely long remarks', () => {
        const result = remarksFieldSchema.safeParse('A'.repeat(5000));
        expect(result.success).to.be.false;
      });
    });

    describe('Edge Cases', () => {
      it('should validate single character', () => {
        const result = remarksFieldSchema.safeParse('A');
        expect(result.success).to.be.true;
      });

      it('should validate exactly 2000 characters', () => {
        const result = remarksFieldSchema.safeParse('B'.repeat(2000));
        expect(result.success).to.be.true;
      });

      it('should validate whitespace only', () => {
        const result = remarksFieldSchema.safeParse('   ');
        expect(result.success).to.be.true;
      });

      it('should validate newlines only', () => {
        const result = remarksFieldSchema.safeParse('\n\n\n');
        expect(result.success).to.be.true;
      });
    });
  });

  describe('remarksSchema', () => {
    describe('Valid Remarks Objects', () => {
      it('should validate empty remarks', () => {
        const result = remarksSchema.safeParse({
          remarks: '',
        });
        expect(result.success).to.be.true;
      });

      it('should validate undefined remarks', () => {
        const result = remarksSchema.safeParse({
          remarks: undefined,
        });
        expect(result.success).to.be.true;
      });

      it('should validate Prime Directive remark', () => {
        const result = remarksSchema.safeParse({
          remarks: 'Adhered to Guild Code of Conduct throughout the mission.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate commendation remark', () => {
        const result = remarksSchema.safeParse({
          remarks:
            'Hunter demonstrated exceptional tracking skills during high-value target acquisition on Tatooine.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate medical remark', () => {
        const result = remarksSchema.safeParse({
          remarks:
            'Treated for blaster wounds sustained during target extraction on Nar Shaddaa.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate long detailed remark', () => {
        const longRemark =
          'Throughout the five-year contract period, Boba Fett demonstrated exceptional bounty hunting skills, successfully capturing high-value targets across the Outer Rim, maintaining a perfect Guild safety record, and upholding the Guild Code of Conduct. His tactical expertise and professionalism resulted in the successful completion of all assigned contracts without collateral incidents.';
        const result = remarksSchema.safeParse({
          remarks: longRemark,
        });
        expect(result.success).to.be.true;
      });
    });

    describe('Invalid Remarks Objects', () => {
      it('should reject remarks over 2000 characters', () => {
        const result = remarksSchema.safeParse({
          remarks: 'C'.repeat(2001),
        });
        expect(result.success).to.be.false;
      });

      it('should reject extremely long remarks', () => {
        const result = remarksSchema.safeParse({
          remarks: 'D'.repeat(10000),
        });
        expect(result.success).to.be.false;
      });
    });

    describe('Missing Remarks Field', () => {
      it('should validate object without remarks field', () => {
        const result = remarksSchema.safeParse({});
        expect(result.success).to.be.true;
      });
    });

    describe('Themed Remarks', () => {
      it('should validate Cad Bane quote', () => {
        const result = remarksSchema.safeParse({
          remarks: 'I take on any job - for the right price.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Boba Fett quote', () => {
        const result = remarksSchema.safeParse({
          remarks: 'Bounty hunting is a complicated profession.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Aurra Sing quote', () => {
        const result = remarksSchema.safeParse({
          remarks: 'Credits are the only thing that matters.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Jango Fett quote', () => {
        const result = remarksSchema.safeParse({
          remarks: 'Always a pleasure to meet a Guild member.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Bossk quote', () => {
        const result = remarksSchema.safeParse({
          remarks: 'The job is done.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate professional remark', () => {
        const result = remarksSchema.safeParse({
          remarks: 'Contract fulfilled according to Guild specifications.',
        });
        expect(result.success).to.be.true;
      });
    });

    describe('Edge Cases', () => {
      it('should handle minimum valid data', () => {
        const result = remarksSchema.safeParse({
          remarks: 'A',
        });
        expect(result.success).to.be.true;
      });

      it('should handle maximum length remarks', () => {
        const result = remarksSchema.safeParse({
          remarks: 'E'.repeat(2000),
        });
        expect(result.success).to.be.true;
      });

      it('should handle multiline remarks with tabs', () => {
        const result = remarksSchema.safeParse({
          remarks: 'Line 1\n\tIndented line\n\t\tDouble indent',
        });
        expect(result.success).to.be.true;
      });
    });
  });
});
