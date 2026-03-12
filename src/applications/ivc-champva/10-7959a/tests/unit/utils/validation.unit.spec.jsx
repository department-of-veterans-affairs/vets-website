import sinon from 'sinon-v20';
import { validateChars, validateDateRange } from '../../../utils/validation';

describe('10-7959a `validateChars` form validation', () => {
  let addErrorSpy;
  let errors;

  beforeEach(() => {
    addErrorSpy = sinon.spy();
    errors = { addError: addErrorSpy };
  });

  afterEach(() => {
    addErrorSpy.resetHistory();
  });

  it('should not add error when text contains only valid characters', () => {
    validateChars(errors, 'Valid text with letters and numbers 123');
    sinon.assert.notCalled(addErrorSpy);
  });

  it('should add error when text contains a single invalid character', () => {
    validateChars(errors, 'text with $ symbol');
    sinon.assert.calledOnce(addErrorSpy);
    sinon.assert.calledWith(addErrorSpy, sinon.match(/this character.*\$/));
  });

  it('should add error when text contains multiple invalid characters', () => {
    validateChars(errors, 'text with $@# symbols');
    sinon.assert.calledOnce(addErrorSpy);
    sinon.assert.calledWith(addErrorSpy, sinon.match(/these characters/));
  });

  it('should not add error for empty string', () => {
    validateChars(errors, '');
    sinon.assert.notCalled(addErrorSpy);
  });

  it('should allow hyphens, periods, apostrophes, and commas', () => {
    validateChars(errors, "Text with - . ' , allowed");
    sinon.assert.notCalled(addErrorSpy);
  });
});

describe('10-7959a `validateDateRange` form validation', () => {
  let errors;
  let startDateSpy;
  let endDateSpy;

  const runValidator = (opts = {}) =>
    validateDateRange({
      startDateKey: 'serviceStartDate',
      endDateKey: 'serviceEndDate',
      ...opts,
    });

  beforeEach(() => {
    startDateSpy = sinon.spy();
    endDateSpy = sinon.spy();
    errors = {
      serviceStartDate: { addError: startDateSpy },
      serviceEndDate: { addError: endDateSpy },
    };
  });

  afterEach(() => {
    startDateSpy.resetHistory();
    endDateSpy.resetHistory();
  });

  it('should not add error when dates are valid and in correct order', () => {
    const data = {
      serviceStartDate: '2020-01-01',
      serviceEndDate: '2021-01-01',
    };
    runValidator()(errors, data);
    sinon.assert.notCalled(endDateSpy);
  });

  it('should not add error when termination date is omitted', () => {
    const data = {
      serviceStartDate: '2020-01-01',
      serviceEndDate: undefined,
    };
    runValidator()(errors, data);
    sinon.assert.notCalled(endDateSpy);
  });

  it('should add error when termination date is before effective date', () => {
    const data = {
      serviceStartDate: '2021-01-01',
      serviceEndDate: '2020-01-01',
    };
    runValidator()(errors, data);
    sinon.assert.calledOnce(endDateSpy);
  });

  it('should add error when termination date is invalid', () => {
    const data = {
      serviceStartDate: '2020-01-01',
      serviceEndDate: 'invalid-date',
    };
    runValidator()(errors, data);
    sinon.assert.calledOnce(endDateSpy);
  });

  it('should add error when termination date is same as effective date', () => {
    const data = {
      serviceStartDate: '2020-01-01',
      serviceEndDate: '2020-01-01',
    };
    runValidator()(errors, data);
    sinon.assert.calledOnce(endDateSpy);
  });

  it('should use custom error messages when provided', () => {
    const data = {
      serviceStartDate: '2021-01-01',
      serviceEndDate: '2020-01-01',
    };
    const rangeErrorMessage = 'Custom error message';
    runValidator({ rangeErrorMessage })(errors, data);
    sinon.assert.calledWith(endDateSpy, rangeErrorMessage);
  });
});
