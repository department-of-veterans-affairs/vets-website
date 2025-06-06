import sinon from 'sinon';
import { expect } from 'chai';
import {
  parseNumber,
  minMaxValidation,
} from '../web-component-patterns/numberPattern';
import {
  symbolsValidation,
  emailValidation,
} from '../web-component-patterns/emailPattern';
import { validateNameSymbols } from '../web-component-patterns/fullNamePattern';

describe('parseNumber', () => {
  it('should parse a number string', () => {
    expect(parseNumber('123.45')).to.equal(123.45);
  });

  it('should return same number (not a string)', () => {
    expect(parseNumber(345.67)).to.equal(345.67);
    expect(parseNumber(1.2345e2)).to.equal(123.45);
  });

  it('should parse a scientific notation string', () => {
    expect(parseNumber('1.23e+2')).to.equal(123);
  });

  it('should return NaN for an invalid number or empty string', () => {
    expect(parseNumber('abc')).to.be.NaN;
    expect(parseNumber('')).to.be.NaN;
  });
});

describe('minMaxValidation', () => {
  it('should add an error if the number is less than the minimum range', () => {
    const errors = { addError: sinon.stub() };
    const formData = '2';
    const min = 3;
    const max = 10;
    const errorMessages = {
      min: `Enter a number larger than 2`,
    };

    const validation = minMaxValidation(min, max);
    validation(errors, formData, null, null, errorMessages);
    expect(errors.addError.calledWith(errorMessages.min)).to.be.true;
  });

  it('should add an error if the number is in scientific notation and less than the minimum range', () => {
    const errors = { addError: sinon.stub() };
    const formData = '-2.34e+10';
    const min = 1;
    const max = 10;
    const errorMessages = { min: `Enter a number greater than ${min}` };

    const validation = minMaxValidation(min, max);
    validation(errors, formData, null, null, errorMessages);
    expect(errors.addError.calledWith(errorMessages.min)).to.be.true;
  });

  it('should add an error if the number is greater than the maximum range', () => {
    const errors = { addError: sinon.stub() };
    const formData = '11';
    const min = 3;
    const max = 10;
    const errorMessages = { max: `Enter a number between ${min} and ${max}` };

    const validation = minMaxValidation(min, max);
    validation(errors, formData, null, null, errorMessages);
    expect(errors.addError.calledWith(errorMessages.max)).to.be.true;
  });

  it('should add an error if the number is in scientific notation and greater than the maximum range', () => {
    const errors = { addError: sinon.stub() };
    const formData = '4.5e+10';
    const min = 3;
    const max = 10;
    const errorMessages = { max: `Enter a number between ${min} and ${max}` };

    const validation = minMaxValidation(min, max);
    validation(errors, formData, null, null, errorMessages);
    expect(errors.addError.calledWith(errorMessages.max)).to.be.true;
  });

  it('should not add an error if the number is within the range', () => {
    const errors = { addError: sinon.stub() };
    const formData = '5';
    const min = 3;
    const max = 10;
    const errorMessages = {};

    const validation = minMaxValidation(min, max);
    validation(errors, formData, null, null, errorMessages);
    expect(errors.addError.called).to.be.false;
  });

  it('should use custom error messages if provided', () => {
    const errors = { addError: sinon.stub() };
    const formData = '2';
    const min = 3;
    const max = 10;
    const errorMessages = { min: 'Custom min error message' };

    const validation = minMaxValidation(min, max);
    validation(errors, formData, null, null, errorMessages);
    expect(errors.addError.calledWith(errorMessages.min)).to.be.true;
  });
});

describe('email validation', () => {
  const errorMessages = {
    symbols: `Error symbols message`,
    format: `Error format message`,
  };

  it('should show an error message specific to symbol validation', () => {
    const errors = { addError: sinon.stub() };
    const value = 'email[]@name.com';
    symbolsValidation(errors, value, null, null, errorMessages);
    expect(errors.addError.calledWith(errorMessages.symbols)).to.be.true;
  });

  it('should show an error message specific to email format validation', () => {
    const errors = { addError: sinon.stub() };
    const value = 'name@email';
    emailValidation(errors, value, null, null, errorMessages);
    expect(errors.addError.calledWith(errorMessages.format)).to.be.true;
  });

  it('should show an error message for white space', () => {
    const errors = { addError: sinon.stub() };
    const value = 'na me@email.com';
    emailValidation(errors, value, null, null, errorMessages);
    expect(errors.addError.calledWith(errorMessages.format)).to.be.true;
  });

  it('should not show an error message for a valid email', () => {
    const errors = { addError: sinon.stub() };
    const value = 'User_name32+ok-name@email.va';
    emailValidation(errors, value, null, null, errorMessages);
    expect(errors.addError.called).to.be.false;
  });
});

describe('name symbol validation', () => {
  const errorMessages = {
    symbols: `Error symbols message`,
  };

  it('should show an error message specific to name symbol validation', () => {
    const errors = { addError: sinon.stub() };
    // Accented characters like this are not allowed in some APIs, however
    // we can choose pass this, and let our local backend handle this instead.
    const value = 'José Ramírez';
    validateNameSymbols(errors, value, null, null, errorMessages);
    expect(errors.addError.calledWithMatch(errorMessages.symbols)).to.be.false;
  });

  it('should show an error message specific to name symbol validation', () => {
    const errors = { addError: sinon.stub() };
    const value = 'Oops;';
    validateNameSymbols(errors, value, null, null, errorMessages);
    expect(errors.addError.calledWithMatch(errorMessages.symbols)).to.be.true;
  });

  it('should show an error message specific to name symbol validation', () => {
    const errors = { addError: sinon.stub() };
    const value = 'The "name"';
    validateNameSymbols(errors, value, null, null, errorMessages);
    expect(errors.addError.calledWithMatch(errorMessages.symbols)).to.be.true;
  });
});
