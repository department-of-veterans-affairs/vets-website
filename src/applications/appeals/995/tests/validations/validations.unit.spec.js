import { expect } from 'chai';
import sinon from 'sinon';

import {
  checkValidations,
  requireRatedDisability,
  missingPrimaryPhone,
} from '../../validations';
import { missingIssueName } from '../../validations/issues';
import { errorMessages, PRIMARY_PHONE } from '../../constants';

import { SELECTED } from '../../../shared/constants';

describe('checkValidations', () => {
  it('should return error messages', () => {
    expect(checkValidations([missingIssueName], '')).to.deep.equal([
      errorMessages.missingIssue, // simple validation function
    ]);
    expect(
      checkValidations([missingIssueName, missingIssueName], ''),
    ).to.deep.equal([errorMessages.missingIssue, errorMessages.missingIssue]);
  });
});

describe('requireRatedDisability', () => {
  it('should show an error if no disabilities are selected', () => {
    const errors = { addError: sinon.spy() };
    requireRatedDisability(errors, [{}, {}]);
    expect(errors.addError.calledWith(errorMessages.contestedIssue)).to.be.true;
  });
  it('should not show an error if a disabilitiy is selected', () => {
    const errors = { addError: sinon.spy() };
    requireRatedDisability(errors, [{}, { [SELECTED]: true }]);
    expect(errors.addError.notCalled).to.be.true;
  });
});

describe('missingPrimaryPhone', () => {
  it('should show an error if no primary phone selected', () => {
    const errors = { addError: sinon.spy() };
    missingPrimaryPhone(errors, {}, {});
    expect(errors.addError.calledWith(errorMessages.missingPrimaryPhone)).to.be
      .true;
  });
  it('should not show an error if a primary phone is selected', () => {
    const errors = { addError: sinon.spy() };
    missingPrimaryPhone(errors, {}, { [PRIMARY_PHONE]: 'home' });
    expect(errors.addError.notCalled).to.be.true;
  });
});
