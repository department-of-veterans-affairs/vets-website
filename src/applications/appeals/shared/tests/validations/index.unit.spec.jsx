import { expect } from 'chai';
import sinon from 'sinon';

import { SELECTED } from '../../constants';

import {
  validateRequireRatedDisability,
  checkValidations,
} from '../../validations';
import { missingIssueName } from '../../validations/issues';
import errorMessages from '../../content/errorMessages';

describe('validateRequireRatedDisability', () => {
  it('should not throw an error when no errors is passed to function', () => {
    expect(validateRequireRatedDisability()).to.eq(undefined);
  });
  it('should add a error message', () => {
    const errors = { addError: sinon.spy() };
    const contestedIssue = 'some error';
    validateRequireRatedDisability(errors, [], { contestedIssue });
    expect(errors.addError.args[0][0]).to.eq(contestedIssue);
  });
  it('should not add a error message', () => {
    const errors = { addError: sinon.spy() };
    const contestedIssue = 'some error';
    const data = [{}, { [SELECTED]: true }];
    validateRequireRatedDisability(errors, data, { contestedIssue });
    expect(errors.addError.notCalled).to.be.true;
  });
});

describe('checkValidations', () => {
  it('should return empty error array', () => {
    expect(checkValidations()).to.deep.equal([]);
  });
  it('should return error messages', () => {
    expect(checkValidations([missingIssueName], '')).to.deep.equal([
      errorMessages.missingIssue, // simple validation function
    ]);
    expect(
      checkValidations([missingIssueName, missingIssueName], ''),
    ).to.deep.equal([errorMessages.missingIssue, errorMessages.missingIssue]);
  });
});
