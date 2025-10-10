import { expect } from 'chai';
import { validateInitials } from '../helpers';

describe('0839 Helpers', () => {
  describe('validateInitials', () => {
    const firstName = 'John';
    const lastName = 'Doe';

    it('returns error when inputValue contains non-letter characters', () => {
      expect(validateInitials('J1', firstName, lastName)).to.equal(
        'Please enter your initials using letters only',
      );
    });

    it('returns error when inputValue contains special characters', () => {
      expect(validateInitials('J@', firstName, lastName)).to.equal(
        'Please enter your initials using letters only',
      );
    });

    it('returns error when inputValue contains spaces', () => {
      expect(validateInitials('J D', firstName, lastName)).to.equal(
        'Please enter your initials using letters only',
      );
    });

    it('does not error when initials match first and last name', () => {
      expect(validateInitials('JD', firstName, lastName)).to.equal('');
    });

    it('returns error when first initial does not match', () => {
      expect(validateInitials('AD', firstName, lastName)).to.equal(
        `Initials must match your name: ${firstName} ${lastName}`,
      );
    });

    it('returns error when last initial does not match', () => {
      expect(validateInitials('JA', firstName, lastName)).to.equal(
        `Initials must match your name: ${firstName} ${lastName}`,
      );
    });

    it('returns error when both initials do not match', () => {
      expect(validateInitials('AB', firstName, lastName)).to.equal(
        `Initials must match your name: ${firstName} ${lastName}`,
      );
    });

    describe('with hyphenated last name', () => {
      const hyphenatedLastName = 'Smith-Jones';

      it('returns error when third initial does not match second part of hyphenated last name', () => {
        expect(validateInitials('JSA', firstName, hyphenatedLastName)).to.equal(
          `Initials must match your name: ${firstName} ${hyphenatedLastName}`,
        );
      });

      it('returns empty string when only 2 initials provided for hyphenated last name', () => {
        expect(validateInitials('JS', firstName, hyphenatedLastName)).to.equal(
          '',
        );
      });
    });
  });
});
