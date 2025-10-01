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
      const validNames = ['John', 'Mary-Jane', "O'Connor", 'Jean Paul'];

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
      const result = firstNameSchema.safeParse('  John  ');
      expect(result.success).to.be.true;
      expect(result.data).to.equal('John');
    });
  });

  describe('middleNameSchema', () => {
    it('validates middle names', () => {
      const validNames = ['Marie', 'Ann', 'Lee', ''];

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
      const validNames = ['Smith', 'Van Der Berg', "O'Brien", 'De La Cruz'];

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
      const validSuffixes = ['Jr.', 'Sr.', 'III', 'IV', 'V'];

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
        first: 'John',
        middle: 'Michael',
        last: 'Smith',
        suffix: 'Jr.',
      };

      const result = fullNameSchema.safeParse(validFullName);
      expect(result.success).to.be.true;
      expect(result.data).to.deep.equal(validFullName);
    });

    it('validates names without middle', () => {
      const validFullName = {
        first: 'Jane',
        last: 'Doe',
      };

      const result = fullNameSchema.safeParse(validFullName);
      expect(result.success).to.be.true;
    });

    it('validates names without suffix', () => {
      const validFullName = {
        first: 'Jane',
        middle: 'Ann',
        last: 'Doe',
      };

      const result = fullNameSchema.safeParse(validFullName);
      expect(result.success).to.be.true;
    });

    it('requires first and last names', () => {
      const invalidFullNames = [
        { first: 'John' }, // missing last
        { last: 'Smith' }, // missing first
        {}, // missing both
      ];

      invalidFullNames.forEach(name => {
        const result = fullNameSchema.safeParse(name);
        expect(result.success).to.be.false;
      });
    });

    it('trims whitespace from all parts', () => {
      const nameWithSpaces = {
        first: '  John  ',
        middle: '  Michael  ',
        last: '  Smith  ',
        suffix: '  Jr.  ',
      };

      const result = fullNameSchema.safeParse(nameWithSpaces);
      expect(result.success).to.be.true;
      expect(result.data.first).to.equal('John');
      expect(result.data.middle).to.equal('Michael');
      expect(result.data.last).to.equal('Smith');
      expect(result.data.suffix).to.equal('Jr.');
    });

    it('handles special characters', () => {
      const specialNames = {
        first: "D'Angelo",
        middle: 'Mary-Beth',
        last: "O'Connor-Smith",
      };

      const result = fullNameSchema.safeParse(specialNames);
      expect(result.success).to.be.true;
    });
  });
});
