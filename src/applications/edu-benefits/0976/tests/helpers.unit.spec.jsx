import { expect } from 'chai';
import { getAtPath, setAtPath, validateInitialsMatch } from '../helpers';

describe('0839 Helpers', () => {
  describe('validateInitialsMatch', () => {
    let errors;
    const formData = {
      authorizingOfficial: {
        fullName: {
          first: 'John',
          last: 'Doe',
        },
      },
    };

    beforeEach(() => {
      errors = {
        messages: [],
        addError(message) {
          this.messages.push(message);
        },
      };
    });

    it('correctly matches initials', () => {
      validateInitialsMatch(errors, 'JD', formData);
      expect(errors.messages.length).to.eq(0);
    });

    it('correctly does nothing with no input', () => {
      validateInitialsMatch(errors, '', formData);
      expect(errors.messages.length).to.eq(0);
    });

    it('correctly returns an error with blank name', () => {
      validateInitialsMatch(errors, 'XX', {
        authorizingOfficial: { fullName: {} },
      });
      expect(errors.messages.length).to.eq(1);
    });

    it('correctly shows an error on unmatched initials', () => {
      validateInitialsMatch(errors, 'XX', formData);
      expect(errors.messages.length).to.eq(1);
    });

    it('correctly shows an error on unsupported characters', () => {
      validateInitialsMatch(errors, '$$', formData);
      expect(errors.messages.length).to.eq(1);
    });

    it('correctly handles hyphenated last names', () => {
      formData.authorizingOfficial.fullName.last = 'Doe-Poe';
      validateInitialsMatch(errors, 'JDP', formData);
      expect(errors.messages.length).to.eq(0);
    });
  });

  describe('getAtPath', () => {
    it('gets the right value', () => {
      const original = {
        a: 1,
        b: { c: [1, { d: 'hello' }, 3] },
      };

      expect(getAtPath(original, 'a')).to.eq(1);
      expect(getAtPath(original, 'b.c.2')).to.eq(3);
      expect(getAtPath(original, 'b.c.1.d')).to.eq('hello');
    });
  });

  describe('setAtPath', () => {
    it('sets the right value', () => {
      const original = {
        a: 1,
        b: { c: 'A' },
      };

      setAtPath(original, 'a', 15);
      expect(original.a).to.eq(15);
    });

    it('sets the right value', () => {
      const original = {
        a: 1,
        b: { c: 'A' },
      };

      setAtPath(original, 'b.c', 'Q');
      expect(original.b.c).to.eq('Q');
    });

    it('sets the right value', () => {
      const original = {
        a: 1,
        b: { c: [1, { d: 'hello' }, 3] },
      };

      setAtPath(original, 'b.c.1.d', 'goodbye');
      expect(original.b.c[1].d).to.eq('goodbye');
    });
  });
});
