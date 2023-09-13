import { expect } from 'chai';
import sinon from 'sinon';

import {
  checkValidations,
  requireRatedDisability,
  contactInfoValidation,
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

describe('contactInfoValidation', () => {
  const getData = ({
    email = true,
    homePhone = true,
    mobilePhone = true,
    address = true,
  } = {}) => ({
    veteran: {
      email: email ? 'placeholder' : '',
      homePhone: homePhone ? { phoneNumber: 'placeholder' } : {},
      mobilePhone: mobilePhone ? { phoneNumber: 'placeholder' } : {},
      address: address ? { addressLine1: 'placeholder' } : {},
    },
  });
  it('should not show an error when data is available', () => {
    const addError = sinon.spy();
    contactInfoValidation({ addError }, null, getData());
    expect(addError.notCalled).to.be.true;
  });
  it('should have an error when email is missing', () => {
    const addError = sinon.spy();
    contactInfoValidation({ addError }, null, getData({ email: false }));
    expect(addError.called).to.be.true;
    expect(addError.args[0][0]).to.eq(errorMessages.missingEmail);
  });
  it('should have one error when email & home phone are missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, homePhone: false }),
    );
    expect(addError.called).to.be.true;
    expect(addError.firstCall.args[0]).to.eq(errorMessages.missingEmail);
  });
  it('should have multiple errors when everything is missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({
        email: false,
        homePhone: false,
        mobilePhone: false,
        address: false,
      }),
    );
    expect(addError.called).to.be.true;
    expect(addError.firstCall.args[0]).to.eq(errorMessages.missingEmail);
    expect(addError.secondCall.args[0]).to.eq(errorMessages.missingPhone);
    expect(addError.lastCall.args[0]).to.eq(errorMessages.missingAddress);
  });
  it('should not throw an error when addError function is missing', () => {
    try {
      contactInfoValidation();
      expect(true).to.be.true;
    } catch (error) {
      expect(error).to.be.null;
    }
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
