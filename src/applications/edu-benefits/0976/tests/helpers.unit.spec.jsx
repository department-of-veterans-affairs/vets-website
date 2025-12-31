import { expect } from 'chai';
import { validateInitialsMatch } from '../helpers';

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
});
