import { expect } from 'chai';
import sinon from 'sinon';

import {
  requireRatedDisability,
  contactInfoValidation,
} from '../../validations';
import { errorMessages, SELECTED } from '../../constants';

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
    phone = true,
    address = true,
    homeless = false,
  } = {}) => ({
    veteran: {
      email: email ? 'placeholder' : '',
      phone: phone ? { phoneNumber: 'placeholder' } : {},
      address: address ? { addressLine1: 'placeholder' } : {},
    },
    homeless,
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
    expect(addError.args[0][0]).to.contain('add an email');
  });
  it('should have multiple errors when email & phone are missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, phone: false }),
    );
    expect(addError.called).to.be.true;
    expect(addError.firstCall.args[0]).to.contain('add an email');
    expect(addError.secondCall.args[0]).to.contain('add a phone');
  });
  it('should have multiple errors when everything is missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, phone: false, address: false }),
    );
    expect(addError.called).to.be.true;
    expect(addError.firstCall.args[0]).to.contain('add an email');
    expect(addError.secondCall.args[0]).to.contain('add a phone');
    expect(addError.thirdCall.args[0]).to.contain('add an address');
  });
  it('should not include address when homeless is true', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ address: false, homeless: true }),
    );
    expect(addError.called).to.be.false;
  });
});
