import { expect } from 'chai';
import sinon from 'sinon';

import {
  validateHomePhone,
  validateMobilePhone,
  validateEmail,
  validateEffectiveDate,
} from '../../utils/validations';
import directDeposit from '../../pages/directDeposit';

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

describe('Account Number Confirmation Validation', () => {
  let errors;

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  it('should show error when confirmation does not match account number', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      'view:directDeposit': {
        bankAccount: {
          accountNumber: '12345678',
          accountNumberConfirmation: '87654321',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount
        .accountNumberConfirmation['ui:validations'][0];
    validationFn(errors, '87654321', formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Your bank account number must match',
    );
  });

  it('should not show error when confirmation matches account number', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      'view:directDeposit': {
        bankAccount: {
          accountNumber: '12345678',
          accountNumberConfirmation: '12345678',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount
        .accountNumberConfirmation['ui:validations'][0];
    validationFn(errors, '12345678', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not validate when feature flag is disabled', () => {
    const formData = {
      mebBankInfoConfirmationField: false,
      'view:directDeposit': {
        bankAccount: {
          accountNumber: '12345678',
          accountNumberConfirmation: '87654321',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount
        .accountNumberConfirmation['ui:validations'][0];
    validationFn(errors, '87654321', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not show error when confirmation field is empty', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      'view:directDeposit': {
        bankAccount: {
          accountNumber: '12345678',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount
        .accountNumberConfirmation['ui:validations'][0];
    validationFn(errors, '', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not show error when account number is missing', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      'view:directDeposit': {
        bankAccount: {
          accountNumberConfirmation: '12345678',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount
        .accountNumberConfirmation['ui:validations'][0];
    validationFn(errors, '12345678', formData);

    expect(errors.addError.called).to.be.false;
  });
});

describe('Routing Number Confirmation Validation', () => {
  let errors;

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  it('should show error when confirmation does not match routing number', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      'view:directDeposit': {
        bankAccount: {
          routingNumber: '123456789',
          routingNumberConfirmation: '987654321',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount
        .routingNumberConfirmation['ui:validations'][0];
    validationFn(errors, '987654321', formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Your routing number must match',
    );
  });

  it('should not show error when confirmation matches routing number', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      'view:directDeposit': {
        bankAccount: {
          routingNumber: '123456789',
          routingNumberConfirmation: '123456789',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount
        .routingNumberConfirmation['ui:validations'][0];
    validationFn(errors, '123456789', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not validate when feature flag is disabled', () => {
    const formData = {
      mebBankInfoConfirmationField: false,
      'view:directDeposit': {
        bankAccount: {
          routingNumber: '123456789',
          routingNumberConfirmation: '987654321',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount
        .routingNumberConfirmation['ui:validations'][0];
    validationFn(errors, '987654321', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not show error when confirmation field is empty', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      'view:directDeposit': {
        bankAccount: {
          routingNumber: '123456789',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount
        .routingNumberConfirmation['ui:validations'][0];
    validationFn(errors, '', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not show error when routing number is missing', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      'view:directDeposit': {
        bankAccount: {
          routingNumberConfirmation: '123456789',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount
        .routingNumberConfirmation['ui:validations'][0];
    validationFn(errors, '123456789', formData);

    expect(errors.addError.called).to.be.false;
  });
});

describe('Routing Number and Account Number Cannot Match Validation', () => {
  let errors;

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  it('should show error on routing number field when routing number matches account number', () => {
    const formData = {
      'view:directDeposit': {
        bankAccount: {
          routingNumber: '123456789',
          accountNumber: '123456789',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount.routingNumber[
        'ui:validations'
      ][0];
    validationFn(errors, '123456789', formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Your bank account and routing number cannot match',
    );
  });

  it('should show error on account number field when account number matches routing number', () => {
    const formData = {
      'view:directDeposit': {
        bankAccount: {
          routingNumber: '123456789',
          accountNumber: '123456789',
        },
      },
    };

    const validationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount.accountNumber[
        'ui:validations'
      ][0];
    validationFn(errors, '123456789', formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Your bank account and routing number cannot match',
    );
  });

  it('should not show error when routing number and account number are different', () => {
    const formData = {
      'view:directDeposit': {
        bankAccount: {
          routingNumber: '123456789',
          accountNumber: '987654321',
        },
      },
    };

    const routingValidationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount.routingNumber[
        'ui:validations'
      ][0];
    routingValidationFn(errors, '123456789', formData);

    expect(errors.addError.called).to.be.false;

    const accountValidationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount.accountNumber[
        'ui:validations'
      ][0];
    accountValidationFn(errors, '987654321', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not show error when either field is empty', () => {
    const formDataEmptyRouting = {
      'view:directDeposit': {
        bankAccount: {
          routingNumber: '',
          accountNumber: '123456789',
        },
      },
    };

    const routingValidationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount.routingNumber[
        'ui:validations'
      ][0];
    routingValidationFn(errors, '', formDataEmptyRouting);

    expect(errors.addError.called).to.be.false;

    const formDataEmptyAccount = {
      'view:directDeposit': {
        bankAccount: {
          routingNumber: '123456789',
          accountNumber: '',
        },
      },
    };

    const accountValidationFn =
      directDeposit.uiSchema['view:directDeposit'].bankAccount.accountNumber[
        'ui:validations'
      ][0];
    accountValidationFn(errors, '', formDataEmptyAccount);

    expect(errors.addError.called).to.be.false;
  });
});
