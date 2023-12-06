import sinon from 'sinon';
import { expect } from 'chai';
import { minMaxValidation } from '../web-component-patterns/numberPattern';

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
