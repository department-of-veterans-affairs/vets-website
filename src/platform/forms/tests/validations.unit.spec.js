import { expect } from 'chai';
import { spy } from 'sinon';

import {
  isBlank,
  // isBlankDateField,
  // isBlankMonthYear,
  // isDirtyDate,
  // isFullDate,
  isNotBlank,
  // isNotBlankDateField,
  // isValidBirthDate,
  // isValidBirthYear,
  isValidDate,
  isValidDateRange,
  // isValidEmail,
  // isValidFullNameField,
  // isValidField,
  // isValidMonths,
  isValidName,
  isValidMonetaryValue,
  // isValidPhone,
  // isValidRequiredField,
  isValidSSN,
  // isValidValue,
  isValidZipcode,
  validateCustomFormComponent,
  // validateDateOfBirth,
  // validateIfDirty,
  // validateIfDirtyDate,
  validateLength,
  // isValidRoutingNumber,
  validateWhiteSpace,
} from '../validations';

describe('Validations unit tests', () => {
  describe('isValidSSN', () => {
    it('accepts ssns of the right one including "invalid" test ones', () => {
      expect(isValidSSN('111-22-1234')).to.be.true;

      // SSNs have certain invalid versions. These are useful for tests so not
      // the validation should return TRUE for them.
      //
      // For information on invalid values see:
      //   https://secure.ssa.gov/poms.nsf/lnx/0110201035
      expect(isValidSSN('666-22-1234')).to.be.true;
      expect(isValidSSN('900-22-1234')).to.be.true;
      expect(isValidSSN('111221234')).to.be.true;
      expect(isValidSSN('111111112')).to.be.true;
    });

    it('rejects invalid ssn format', () => {
      // Disallow empty.
      expect(isValidSSN('')).to.be.false;

      // 123-45-6789 is invalid.
      expect(isValidSSN('123-45-6789')).to.be.false;

      // Invalid characters.
      expect(isValidSSN('111-22-1%34')).to.be.false;
      expect(isValidSSN('111-22-1A34')).to.be.false;
      expect(isValidSSN('hi mom')).to.be.false;
      expect(isValidSSN('123-456789')).to.be.false;
      expect(isValidSSN('12345-6789')).to.be.false;

      // No leading or trailing spaces.
      expect(isValidSSN('111-22-1A34 ')).to.be.false;
      expect(isValidSSN(' 111-22-1234')).to.be.false;
      expect(isValidSSN('-11-11111111')).to.be.false;

      // Too few numbers is invalid.
      expect(isValidSSN('111-22-123')).to.be.false;

      // Consecutive 0's in each segment is invalid.
      expect(isValidSSN('000-22-1234')).to.be.false;
      expect(isValidSSN('111-00-1234')).to.be.false;
      expect(isValidSSN('111-22-0000')).to.be.false;

      // Values with all the same digit are not allowed
      expect(isValidSSN('111111111')).to.be.false;
      expect(isValidSSN('999-99-9999')).to.be.false;
      expect(isValidSSN('222222222')).to.be.false;
      expect(isValidSSN('444-44-4444')).to.be.false;
    });
  });

  describe('isValidDate', () => {
    it('validate february separately cause its a special snowflake', () => {
      // feb 28 should work always.
      expect(isValidDate('28', '2', '2015')).to.be.true;

      // 2015 is not a leap year.
      expect(isValidDate('29', '2', '2015')).to.be.false;

      // 2016 is a leap year.
      expect(isValidDate('29', '2', '2016')).to.be.true;

      // feb 30 is always bad.
      expect(isValidDate('30', '2', '2016')).to.be.false;

      // feb 1 is always fine.
      expect(isValidDate('1', '2', '2016')).to.be.true;

      // feb 0 is always bad.
      expect(isValidDate('0', '2', '2016')).to.be.false;
    });

    it('validate future dates', () => {
      // future dates are bad.
      expect(isValidDate('1', '1', '2050')).to.be.false;
    });
  });

  describe('isValidDateRange', () => {
    it('validates if to date is after from date', () => {
      const fromDate = {
        day: {
          value: '3',
          dirty: true,
        },
        month: {
          value: '3',
          dirty: true,
        },
        year: {
          value: '2006',
          dirty: true,
        },
      };
      const toDate = {
        day: {
          value: '3',
          dirty: true,
        },
        month: {
          value: '4',
          dirty: true,
        },
        year: {
          value: '2006',
          dirty: true,
        },
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.true;
    });
    it('does not validate to date is before from date', () => {
      const fromDate = {
        day: {
          value: '3',
          dirty: true,
        },
        month: {
          value: '3',
          dirty: true,
        },
        year: {
          value: '2006',
          dirty: true,
        },
      };
      const toDate = {
        day: {
          value: '3',
          dirty: true,
        },
        month: {
          value: '4',
          dirty: true,
        },
        year: {
          value: '2005',
          dirty: true,
        },
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.false;
    });
    it('does validate with partial dates', () => {
      const fromDate = {
        day: {
          value: '3',
          dirty: true,
        },
        month: {
          value: '3',
          dirty: true,
        },
        year: {
          value: '2006',
          dirty: true,
        },
      };
      const toDate = {
        day: {
          value: '',
          dirty: true,
        },
        month: {
          value: '',
          dirty: true,
        },
        year: {
          value: '',
          dirty: true,
        },
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.true;
    });
  });

  describe('isValidName', () => {
    it('correctly validates name', () => {
      expect(isValidName('Test')).to.be.true;
      expect(isValidName('abc')).to.be.true;
      expect(isValidName('Jean-Pierre')).to.be.true;
      expect(isValidName('Vigee Le Brun')).to.be.true;

      expect(isValidName('')).to.be.false;
      expect(isValidName('123')).to.be.false;
      expect(isValidName('#$%')).to.be.false;
      expect(isValidName('Test1')).to.be.false;
      expect(isValidName(' leadingspace')).to.be.false;
      expect(isValidName(' ')).to.be.false;
    });
  });

  describe('isBlank', () => {
    it('correctly validates blank values', () => {
      expect(isBlank('')).to.be.true;

      expect(isBlank('something')).to.be.false;
    });
  });

  describe('isNotBlank', () => {
    it('correctly validates blank values', () => {
      expect(isNotBlank('Test')).to.be.true;
      expect(isNotBlank('abc')).to.be.true;
      expect(isNotBlank('123')).to.be.true;
      expect(isNotBlank('#$%')).to.be.true;

      expect(isNotBlank('')).to.be.false;
    });
  });

  describe('isValidMonetaryValue', () => {
    it('validates monetary values', () => {
      expect(isValidMonetaryValue('100')).to.be.true;
      expect(isValidMonetaryValue('1.99')).to.be.true;
      expect(isValidMonetaryValue('1000')).to.be.true;

      expect(isValidMonetaryValue('')).to.be.false;
      expect(isValidMonetaryValue('1,000')).to.be.false;
      expect(isValidMonetaryValue('abc')).to.be.false;
      expect(isValidMonetaryValue('$100')).to.be.false;
    });
  });

  describe('isValidZipcode', () => {
    it('should return true for valid zipcodes', () => {
      expect(isValidZipcode('12345')).to.be.true;
      expect(isValidZipcode('  12345  ')).to.be.true;
      // this is dumb; non-digits are stripped out, then check if zip is valid
      expect(isValidZipcode('1a2b3c4d5e')).to.be.true;
    });
    it('should return false for invalid zipcodes', () => {
      expect(isValidZipcode()).to.be.false;
      expect(isValidZipcode(null)).to.be.false;
      expect(isValidZipcode('12345-1234')).to.be.false; // no +4 support
      expect(isValidZipcode('1')).to.be.false;
      expect(isValidZipcode('12')).to.be.false;
      expect(isValidZipcode('123')).to.be.false;
      expect(isValidZipcode('1234')).to.be.false;
      expect(isValidZipcode('123456')).to.be.false;
      expect(isValidZipcode('abcdef')).to.be.false;
      expect(isValidZipcode('1234a')).to.be.false;
      expect(isValidZipcode('  123456  ')).to.be.false;
    });
  });

  describe('validateCustomFormComponent', () => {
    it('should return object validation results', () => {
      const validation = {
        valid: false,
        message: 'Test',
      };

      expect(validateCustomFormComponent(validation)).to.equal(validation);
    });
    it('should return passing object validation results', () => {
      const validation = {
        valid: true,
        message: 'Test',
      };

      expect(validateCustomFormComponent(validation).valid).to.be.true;
      expect(validateCustomFormComponent(validation).message).to.be.null;
    });
    it('should return array validation results', () => {
      const validation = [
        {
          valid: true,
          message: 'DoNotShow',
        },
        {
          valid: false,
          message: 'Test',
        },
      ];

      expect(validateCustomFormComponent(validation)).to.equal(validation[1]);
    });
  });

  describe('validateLength', () => {
    it('should return a validation function', () => {
      expect(validateLength(10)).to.be.a('function');
    });

    it('should add an error if the input length is too large', () => {
      const errors = { addError: spy() };
      validateLength(4)(errors, 'More than four characters');
      expect(errors.addError.called).to.be.true;
    });

    it('should not add an error if the input length is not too large', () => {
      const errors = { addError: spy() };
      validateLength(40)(errors, 'Less than forty characters');
      expect(errors.addError.called).to.be.false;
    });
    // validateLength now also calls validateWhiteSpace
    it('should add an error if the input contains only whitespace', () => {
      const errors = { addError: spy() };
      validateLength(4)(errors, '  ');
      expect(errors.addError.called).to.be.true;
    });
  });

  describe('validateWhiteSpace', () => {
    it('should add an error if the input contains only whitespace', () => {
      const errors = { addError: spy() };
      validateWhiteSpace(errors, '    ');
      expect(errors.addError.called).to.be.true;
    });

    it('should not add an error if the input is valid', () => {
      const errors = { addError: spy() };
      validateWhiteSpace(errors, 'valid input');
      expect(errors.addError.called).to.be.false;
    });
  });
});
