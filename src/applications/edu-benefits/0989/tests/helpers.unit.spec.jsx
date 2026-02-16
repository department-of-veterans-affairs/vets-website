import { expect } from 'chai';
import { validateNameMatchesUser, fullNameToString } from '../helpers';

describe('0989 Helpers', () => {
  describe('validateNameMatchesUser', () => {
    let errors;
    const formData = {
      applicantName: {
        first: 'John',
        last: 'Doe',
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

    it('correctly matches full names', () => {
      validateNameMatchesUser(errors, 'John Doe', formData);
      expect(errors.messages.length).to.eq(0);
    });

    it('correctly does nothing with no input', () => {
      validateNameMatchesUser(errors, 'Jane Doe', formData);
      expect(errors.messages.length).to.eq(1);
      expect(errors.messages[0]).to.eq(
        'Enter your name exactly as it appears on your form: John Doe',
      );
    });
  });

  describe('fullNameToString', () => {
    it('gets converts a first/last name', () => {
      expect(fullNameToString({ first: 'John', last: 'Doe' })).to.eq(
        'John Doe',
      );
    });

    it('gets converts a first/middle/last name', () => {
      expect(
        fullNameToString({ first: 'John', middle: 'Kay', last: 'Doe' }),
      ).to.eq('John Kay Doe');
    });
  });
});
