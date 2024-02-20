import { expect } from 'chai';
import sinon from 'sinon';

import {
  isFirstConferenceTimeEmpty,
  checkConferenceTimes,
  validatePhone,
  contactInfoValidation,
} from '../../validations';
import { errorMessages } from '../../constants';

describe('isFirstConferenceTimeEmpty', () => {
  const setTime = time1 => ({ informalConferenceTimes: { time1 } });
  it('should return true if empty', () => {
    expect(isFirstConferenceTimeEmpty({})).to.be.true;
    expect(isFirstConferenceTimeEmpty(setTime())).to.be.true;
    expect(isFirstConferenceTimeEmpty(setTime(''))).to.be.true;
  });
  it('should return false if not empty', () => {
    expect(isFirstConferenceTimeEmpty(setTime('foo'))).to.be.false;
  });
});

describe('Informal conference time validation', () => {
  const mockFormData = { informalConferenceChoice: 'me' };
  it('should show an error if no times are selected', () => {
    const errors = { addError: sinon.spy() };
    checkConferenceTimes(errors, '', mockFormData);
    expect(errors.addError.calledWith(errorMessages.informalConferenceTimes)).to
      .be.true;
  });

  it('should not show an error if a single time is selected', () => {
    const errors = { addError: sinon.spy() };
    const times = 'time0800to1000';
    checkConferenceTimes(errors, times, mockFormData);
    expect(errors.addError.notCalled).to.be.true;
  });

  it('should not show an error if a two times are selected', () => {
    const errors = { addError: sinon.spy() };
    const times = 'time1000to1230';
    checkConferenceTimes(errors, times, mockFormData);
    expect(errors.addError.notCalled).to.be.true;
  });
});

describe('validatePhone', () => {
  const phoneError = errorMessages.informalConferenceContactPhonePattern;
  it('should show an error for an empty string', () => {
    const errors = { addError: sinon.spy() };
    validatePhone(errors, '');
    expect(errors.addError.calledWith(phoneError)).to.be.true;
  });
  it('should show an error for short phone numbers', () => {
    const errors = { addError: sinon.spy() };
    validatePhone(errors, '1234');
    expect(errors.addError.calledWith(phoneError)).to.be.true;
  });
  it('should show an error for long phone numbers', () => {
    const errors = { addError: sinon.spy() };
    validatePhone(errors, '12345678901');
    expect(errors.addError.calledWith(phoneError)).to.be.true;
  });
  it('should show an error for non phone numbers', () => {
    const errors = { addError: sinon.spy() };
    validatePhone(errors, '123abc456');
    expect(errors.addError.calledWith(phoneError)).to.be.true;
  });

  it('should not show an error for a 10-digit number', () => {
    const errors = { addError: sinon.spy() };
    validatePhone(errors, '1234567890');
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
  it('should not throw an error when addError function is missing', () => {
    try {
      contactInfoValidation();
      expect(true).to.be.true;
    } catch (error) {
      expect(error).to.be.null;
    }
  });
});
