import { expect } from 'chai';
import {
  firstNameSchema,
  fullNameSchema,
  lastNameSchema,
  middleNameSchema,
  suffixSchema,
} from './name';

describe('Name Schemas', () => {
  describe('firstNameSchema', () => {
    it('validates first names', () => {
      const validNames = ['Leia', 'Mon-Mothma', "R'tath", 'Jan Ors'];

      validNames.forEach(name => {
        const result = firstNameSchema.safeParse(name);
        expect(result.success).to.be.true;
      });
    });

    it('rejects invalid names', () => {
      const invalidNames = ['', '123John', 'John@Doe', 'J'];

      invalidNames.forEach(name => {
        const result = firstNameSchema.safeParse(name);
        expect(result.success).to.be.false;
      });
    });

    it('enforces length limit', () => {
      const longName = 'a'.repeat(51);
      const result = firstNameSchema.safeParse(longName);
      expect(result.success).to.be.false;
    });

    it('trims whitespace', () => {
      const result = firstNameSchema.safeParse('  Wedge  ');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('Wedge');
    });
  });

  describe('middleNameSchema', () => {
    it('validates middle names', () => {
      const validNames = ['Amidala', 'Natalon', 'Derek', ''];

      validNames.forEach(name => {
        const result = middleNameSchema.safeParse(name);
        expect(result.success).to.be.true;
      });
    });

    it('allows empty middle names', () => {
      const result = middleNameSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('allows undefined middle names', () => {
      const result = middleNameSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('rejects invalid middle names', () => {
      const invalidNames = ['123Middle', 'Middle@Name'];

      invalidNames.forEach(name => {
        const result = middleNameSchema.safeParse(name);
        expect(result.success).to.be.false;
      });
    });
  });

  describe('lastNameSchema', () => {
    it('validates last names', () => {
      const validNames = ['Organa', 'Van Syndulla', "D'Acy", 'De Rieekan'];

      validNames.forEach(name => {
        const result = lastNameSchema.safeParse(name);
        expect(result.success).to.be.true;
      });
    });

    it('rejects invalid last names', () => {
      const invalidNames = ['', '123Smith', 'Smith@123', 'S'];

      invalidNames.forEach(name => {
        const result = lastNameSchema.safeParse(name);
        expect(result.success).to.be.false;
      });
    });

    it('enforces length limit', () => {
      const longName = 'a'.repeat(51);
      const result = lastNameSchema.safeParse(longName);
      expect(result.success).to.be.false;
    });
  });

  describe('suffixSchema', () => {
    it('validates suffixes', () => {
      const validSuffixes = [
        'Commander',
        'Admiral',
        'General',
        'Captain',
        'Senator',
      ];

      validSuffixes.forEach(suffix => {
        const result = suffixSchema.safeParse(suffix);
        expect(result.success).to.be.true;
      });
    });

    it('allows empty suffixes', () => {
      const result = suffixSchema.safeParse('');
      expect(result.success).to.be.true;
      expect(result.data).to.be.undefined;
    });

    it('transforms empty to undefined', () => {
      const result = suffixSchema.safeParse('');
      expect(result.success).to.be.true;
      expect(result.data).to.be.undefined;
    });

    it('allows undefined suffixes', () => {
      const result = suffixSchema.safeParse(undefined);
      expect(result.success).to.be.true;
    });

    it('rejects invalid suffixes', () => {
      const invalidSuffixes = ['123', 'Jr@', 'Junior!!!'];

      invalidSuffixes.forEach(suffix => {
        const result = suffixSchema.safeParse(suffix);
        expect(result.success).to.be.false;
      });
    });
  });

  describe('fullNameSchema', () => {
    it('validates complete names', () => {
      const validFullName = {
        first: 'Leia',
        middle: 'Amidala',
        last: 'Organa',
        suffix: 'Commander',
      };

      const result = fullNameSchema.safeParse(validFullName);
      expect(result.success).to.be.true;
      expect(result.data).to.deep.equal(validFullName);
    });

    it('validates names without middle', () => {
      const validFullName = {
        first: 'Wedge',
        last: 'Antilles',
      };

      const result = fullNameSchema.safeParse(validFullName);
      expect(result.success).to.be.true;
    });

    it('validates names without suffix', () => {
      const validFullName = {
        first: 'Gial',
        middle: 'Natalon',
        last: 'Ackbar',
      };

      const result = fullNameSchema.safeParse(validFullName);
      expect(result.success).to.be.true;
    });

    it('requires first and last names', () => {
      const invalidFullNames = [
        { first: 'Mon' }, // missing last
        { last: 'Mothma' }, // missing first
        {}, // missing both
      ];

      invalidFullNames.forEach(name => {
        const result = fullNameSchema.safeParse(name);
        expect(result.success).to.be.false;
      });
    });

    it('trims whitespace from all parts', () => {
      const nameWithSpaces = {
        first: '  Bail  ',
        middle: '  Prestor  ',
        last: '  Organa  ',
        suffix: '  Senator  ',
      };

      const result = fullNameSchema.safeParse(nameWithSpaces);
      expect(result.success).to.be.true;
      expect(result.data.first).to.equal('Bail');
      expect(result.data.middle).to.equal('Prestor');
      expect(result.data.last).to.equal('Organa');
      expect(result.data.suffix).to.equal('Senator');
    });

    it('handles special characters', () => {
      const specialNames = {
        first: "R'tath",
        middle: 'Mon-Cal',
        last: "D'Acy-Holdo",
      };

      const result = fullNameSchema.safeParse(specialNames);
      expect(result.success).to.be.true;
    });
  });
});
