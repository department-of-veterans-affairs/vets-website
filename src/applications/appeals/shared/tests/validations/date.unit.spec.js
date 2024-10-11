import { expect } from 'chai';
import sinon from 'sinon';

import errorMessages from '../../content/errorMessages';
import { addDateErrorMessages } from '../../validations/date';

describe('addDateErrorMessages', () => {
  it('should not have an error', () => {
    const errors = { addError: sinon.spy() };
    const result = addDateErrorMessages(errors, errorMessages, {});
    expect(errors.addError.called).to.be.false;
    expect(result).to.eq(false);
  });
  it('should show an error when a date is blank', () => {
    const errors = { addError: sinon.spy() };
    const date = { isInvalid: true, errors: {} };
    const result = addDateErrorMessages(errors, errorMessages, date);
    expect(errors.addError.args[0][0]).to.eq(errorMessages.decisions.blankDate);
    expect(date.errors.other).to.be.true;
    expect(result).to.be.true;
  });
  it('should not show an error when a date invalid', () => {
    const errors = { addError: sinon.spy() };
    const date = { hasErrors: true, errors: {} };
    const result = addDateErrorMessages(errors, errorMessages, date);
    expect(errors.addError.args[0][0]).to.eq(errorMessages.invalidDate);
    expect(date.errors.other).to.be.true;
    expect(result).to.be.true;
  });
  it('should not show an error when a date today or in the future', () => {
    const errors = { addError: sinon.spy() };
    const date = { isTodayOrInFuture: true, errors: {} };
    const result = addDateErrorMessages(errors, errorMessages, date);
    expect(errors.addError.args[0][0]).to.eq(errorMessages.decisions.pastDate);
    expect(date.errors.year).to.be.true;
    expect(result).to.be.true;
  });
});
