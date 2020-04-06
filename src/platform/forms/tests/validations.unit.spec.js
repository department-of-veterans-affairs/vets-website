import { spy } from 'sinon';

import {
  isBlank,
  isNotBlank,
  isValidDate,
  isValidDateRange,
  isValidMonetaryValue,
  isValidName,
  isValidSSN,
  validateCustomFormComponent,
  validateLength,
  validateWhiteSpace,
} from '../validations';

describe('Validations unit tests', () => {
  describe('isValidSSN', () => {
    it('accepts ssns of the right one including "invalid" test ones', () => {
      expect(isValidSSN('111-22-1234')).toBe(true);

      // SSNs have certain invalid versions. These are useful for tests so not
      // the validation should return TRUE for them.
      //
      // For information on invalid values see:
      //   https://secure.ssa.gov/poms.nsf/lnx/0110201035
      expect(isValidSSN('666-22-1234')).toBe(true);
      expect(isValidSSN('900-22-1234')).toBe(true);
      expect(isValidSSN('111221234')).toBe(true);
      expect(isValidSSN('111111112')).toBe(true);
    });

    it('rejects invalid ssn format', () => {
      // Disallow empty.
      expect(isValidSSN('')).toBe(false);

      // 123-45-6789 is invalid.
      expect(isValidSSN('123-45-6789')).toBe(false);

      // Invalid characters.
      expect(isValidSSN('111-22-1%34')).toBe(false);
      expect(isValidSSN('111-22-1A34')).toBe(false);
      expect(isValidSSN('hi mom')).toBe(false);
      expect(isValidSSN('123-456789')).toBe(false);
      expect(isValidSSN('12345-6789')).toBe(false);

      // No leading or trailing spaces.
      expect(isValidSSN('111-22-1A34 ')).toBe(false);
      expect(isValidSSN(' 111-22-1234')).toBe(false);
      expect(isValidSSN('-11-11111111')).toBe(false);

      // Too few numbers is invalid.
      expect(isValidSSN('111-22-123')).toBe(false);

      // Consecutive 0's in each segment is invalid.
      expect(isValidSSN('000-22-1234')).toBe(false);
      expect(isValidSSN('111-00-1234')).toBe(false);
      expect(isValidSSN('111-22-0000')).toBe(false);

      // Values with all the same digit are not allowed
      expect(isValidSSN('111111111')).toBe(false);
      expect(isValidSSN('999-99-9999')).toBe(false);
      expect(isValidSSN('222222222')).toBe(false);
      expect(isValidSSN('444-44-4444')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('validate february separately cause its a special snowflake', () => {
      // feb 28 should work always.
      expect(isValidDate('28', '2', '2015')).toBe(true);

      // 2015 is not a leap year.
      expect(isValidDate('29', '2', '2015')).toBe(false);

      // 2016 is a leap year.
      expect(isValidDate('29', '2', '2016')).toBe(true);

      // feb 30 is always bad.
      expect(isValidDate('30', '2', '2016')).toBe(false);

      // feb 1 is always fine.
      expect(isValidDate('1', '2', '2016')).toBe(true);

      // feb 0 is always bad.
      expect(isValidDate('0', '2', '2016')).toBe(false);
    });

    it('validate future dates', () => {
      // future dates are bad.
      expect(isValidDate('1', '1', '2050')).toBe(false);
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
      expect(isValidDateRange(fromDate, toDate)).toBe(true);
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
      expect(isValidDateRange(fromDate, toDate)).toBe(false);
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
          value: '2008',
          dirty: true,
        },
      };
      expect(isValidDateRange(fromDate, toDate)).toBe(true);
    });
  });

  describe('isValidName', () => {
    it('correctly validates name', () => {
      expect(isValidName('Test')).toBe(true);
      expect(isValidName('abc')).toBe(true);
      expect(isValidName('Jean-Pierre')).toBe(true);
      expect(isValidName('Vigee Le Brun')).toBe(true);

      expect(isValidName('')).toBe(false);
      expect(isValidName('123')).toBe(false);
      expect(isValidName('#$%')).toBe(false);
      expect(isValidName('Test1')).toBe(false);
      expect(isValidName(' leadingspace')).toBe(false);
      expect(isValidName(' ')).toBe(false);
    });
  });

  describe('isBlank', () => {
    it('correctly validates blank values', () => {
      expect(isBlank('')).toBe(true);

      expect(isBlank('something')).toBe(false);
    });
  });

  describe('isNotBlank', () => {
    it('correctly validates blank values', () => {
      expect(isNotBlank('Test')).toBe(true);
      expect(isNotBlank('abc')).toBe(true);
      expect(isNotBlank('123')).toBe(true);
      expect(isNotBlank('#$%')).toBe(true);

      expect(isNotBlank('')).toBe(false);
    });
  });

  describe('isValidMonetaryValue', () => {
    it('validates monetary values', () => {
      expect(isValidMonetaryValue('100')).toBe(true);
      expect(isValidMonetaryValue('1.99')).toBe(true);
      expect(isValidMonetaryValue('1000')).toBe(true);

      expect(isValidMonetaryValue('')).toBe(false);
      expect(isValidMonetaryValue('1,000')).toBe(false);
      expect(isValidMonetaryValue('abc')).toBe(false);
      expect(isValidMonetaryValue('$100')).toBe(false);
    });
  });

  describe('validateCustomFormComponent', () => {
    it('should return object validation results', () => {
      const validation = {
        valid: false,
        message: 'Test',
      };

      expect(validateCustomFormComponent(validation)).toBe(validation);
    });
    it('should return passing object validation results', () => {
      const validation = {
        valid: true,
        message: 'Test',
      };

      expect(validateCustomFormComponent(validation).valid).toBe(true);
      expect(validateCustomFormComponent(validation).message).toBeNull();
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

      expect(validateCustomFormComponent(validation)).toBe(validation[1]);
    });
  });

  describe('validateLength', () => {
    it('should return a validation function', () => {
      expect(validateLength(10)).toBeInstanceOf(Function);
    });

    it('should add an error if the input length is too large', () => {
      const errors = { addError: spy() };
      validateLength(4)(errors, 'More than four characters');
      expect(errors.addError.called).toBe(true);
    });

    it('should not add an error if the input length is not too large', () => {
      const errors = { addError: spy() };
      validateLength(40)(errors, 'Less than forty characters');
      expect(errors.addError.called).toBe(false);
    });
  });

  describe('validateWhiteSpace', () => {
    it('should add an error if the input contains only whitespace', () => {
      const errors = { addError: spy() };
      validateWhiteSpace(errors, '    ');
      expect(errors.addError.called).toBe(true);
    });

    it('should not add an error if the input is valid', () => {
      const errors = { addError: spy() };
      validateWhiteSpace(errors, 'valid input');
      expect(errors.addError.called).toBe(false);
    });
  });
});
