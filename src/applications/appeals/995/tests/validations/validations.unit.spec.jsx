import { expect } from 'chai';
import sinon from 'sinon';

import { missingPrimaryPhone } from '../../validations';
import { errorMessages, PRIMARY_PHONE } from '../../constants';

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
