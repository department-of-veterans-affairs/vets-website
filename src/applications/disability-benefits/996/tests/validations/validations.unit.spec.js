import { expect } from 'chai';
import sinon from 'sinon';

import {
  requireRatedDisability,
  isFirstConferenceTimeEmpty,
  checkConferenceTimes,
  validatePhone,
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
