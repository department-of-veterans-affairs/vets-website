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
          'Captain Kirk performed admirably.',
        );
        expect(result.success).to.be.true;
      });

      it('should validate Star Trek mission remark', () => {
        const result = remarksFieldSchema.safeParse(
          'Captain Kirk was instrumental in the successful completion of the five-year mission to explore strange new worlds.',
        );
        expect(result.success).to.be.true;
      });

      it('should validate 2000 character remark', () => {
        const result = remarksFieldSchema.safeParse('A'.repeat(2000));
        expect(result.success).to.be.true;
      });

      it('should validate multiline remark', () => {
        const result = remarksFieldSchema.safeParse(
          'Space: the final frontier.\nThese are the voyages of the starship Enterprise.',
        );
        expect(result.success).to.be.true;
      });

      it('should validate remark with special characters', () => {
        const result = remarksFieldSchema.safeParse(
          'The needs of the many outweigh the needs of the few. - Spock',
        );
        expect(result.success).to.be.true;
      });

      it('should validate remark with numbers', () => {
        const result = remarksFieldSchema.safeParse(
          'USS Enterprise NCC-1701 completed mission on Stardate 2258.42',
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
          remarks:
            'Adhered to Starfleet General Order 1 (Prime Directive) throughout the mission.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate commendation remark', () => {
        const result = remarksSchema.safeParse({
          remarks:
            'Officer demonstrated exceptional leadership during first contact with the Horta species.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate medical remark', () => {
        const result = remarksSchema.safeParse({
          remarks:
            "Treated for Vulcan nerve pinch recovery. - Dr. Leonard 'Bones' McCoy",
        });
        expect(result.success).to.be.true;
      });

      it('should validate long detailed remark', () => {
        const longRemark =
          'Throughout the five-year mission aboard the USS Enterprise, Captain James T. Kirk demonstrated exemplary leadership qualities, successfully negotiating peace treaties with multiple alien species, averting galactic conflicts, and upholding Starfleet values of exploration and diplomacy. His crew showed unwavering loyalty and his decisions saved countless lives across the Federation.';
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

    describe('Star Trek Themed Remarks', () => {
      it('should validate Spock quote', () => {
        const result = remarksSchema.safeParse({
          remarks: 'The needs of the many outweigh the needs of the few.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Kirk quote', () => {
        const result = remarksSchema.safeParse({
          remarks: 'Risk is our business.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate McCoy quote', () => {
        const result = remarksSchema.safeParse({
          remarks: "I'm a doctor, not a bricklayer!",
        });
        expect(result.success).to.be.true;
      });

      it('should validate Scotty quote', () => {
        const result = remarksSchema.safeParse({
          remarks:
            "I'm givin' her all she's got, Captain! The engines cannae take much more!",
        });
        expect(result.success).to.be.true;
      });

      it('should validate Picard quote', () => {
        const result = remarksSchema.safeParse({
          remarks: 'Make it so.',
        });
        expect(result.success).to.be.true;
      });

      it('should validate Data quote', () => {
        const result = remarksSchema.safeParse({
          remarks: 'I am fully functional, programmed in multiple techniques.',
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
