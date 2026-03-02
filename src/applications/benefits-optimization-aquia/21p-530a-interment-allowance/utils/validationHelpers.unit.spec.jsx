/**
 * @module tests/utils/validationHelpers.unit.spec
 * @description Unit tests for validation helper functions
 */

import { expect } from 'chai';
import sinon from 'sinon';
import { validateEndDateAfterStartDate } from './validationHelpers';

describe('validateEndDateAfterStartDate', () => {
  let errors;

  beforeEach(() => {
    errors = {
      addError: sinon.spy(),
    };
  });

  it('should not add error when end date is after start date', () => {
    const endDate = '2020-02-15';
    const formData = {
      dateEnteredService: '2020-01-15',
    };

    validateEndDateAfterStartDate(
      errors,
      endDate,
      formData,
      'dateEnteredService',
      'Test error message',
    );

    expect(errors.addError.called).to.be.false;
  });

  it('should add error when end date is before start date', () => {
    const endDate = '2020-01-10';
    const formData = {
      dateEnteredService: '2020-01-15',
    };

    validateEndDateAfterStartDate(
      errors,
      endDate,
      formData,
      'dateEnteredService',
      'Test error message',
    );

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal('Test error message');
  });

  it('should add error when end date equals start date', () => {
    const endDate = '2020-01-15';
    const formData = {
      dateEnteredService: '2020-01-15',
    };

    validateEndDateAfterStartDate(
      errors,
      endDate,
      formData,
      'dateEnteredService',
      'Test error message',
    );

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal('Test error message');
  });

  it('should not add error when start date is missing', () => {
    const endDate = '2020-02-15';
    const formData = {};

    validateEndDateAfterStartDate(
      errors,
      endDate,
      formData,
      'dateEnteredService',
      'Test error message',
    );

    expect(errors.addError.called).to.be.false;
  });

  it('should not add error when end date is missing', () => {
    const endDate = null;
    const formData = {
      dateEnteredService: '2020-01-15',
    };

    validateEndDateAfterStartDate(
      errors,
      endDate,
      formData,
      'dateEnteredService',
      'Test error message',
    );

    expect(errors.addError.called).to.be.false;
  });

  it('should not add error when both dates are missing', () => {
    const endDate = null;
    const formData = {};

    validateEndDateAfterStartDate(
      errors,
      endDate,
      formData,
      'dateEnteredService',
      'Test error message',
    );

    expect(errors.addError.called).to.be.false;
  });

  it('should use default error message when not provided', () => {
    const endDate = '2020-01-10';
    const formData = {
      dateEnteredService: '2020-01-15',
    };

    validateEndDateAfterStartDate(
      errors,
      endDate,
      formData,
      'dateEnteredService',
    );

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Please enter an end date later than the start date.',
    );
  });

  it('should handle different field names', () => {
    const endDate = '2020-01-10';
    const formData = {
      customStartField: '2020-01-15',
    };

    validateEndDateAfterStartDate(
      errors,
      endDate,
      formData,
      'customStartField',
      'Custom error',
    );

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal('Custom error');
  });
});
