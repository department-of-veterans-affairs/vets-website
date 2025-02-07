import { expect } from 'chai';
import sinon from 'sinon';

import {
  validateHomePhone,
  validateMobilePhone,
  validateEmail,
  validateEffectiveDate,
} from '../../utils/validations';

describe('Phone validation', () => {
  it('validateHomePhone should add error', () => {
    const errors = {
      addError: sinon.spy(),
    };

    validateHomePhone(errors, '1234', {
      homePhone: {
        isInternational: false,
      },
    });

    expect(errors.addError.called).to.be.true;
  });

  it('validateMobilePhone should add error', () => {
    const errors = {
      addError: sinon.spy(),
    };

    validateMobilePhone(errors, '1234', {
      mobilePhone: {
        isInternational: false,
      },
    });

    expect(errors.addError.called).to.be.true;
  });

  it('validateEmail should add error', () => {
    const errors = {
      addError: sinon.spy(),
    };

    validateEmail(errors, 'test');

    expect(errors.addError.called).to.be.true;
  });

  it('validateEffectiveDate should add error', () => {
    const errors = {
      addError: sinon.spy(),
    };

    validateEffectiveDate(errors, '1990-01-01');

    expect(errors.addError.called).to.be.true;
  });
});
