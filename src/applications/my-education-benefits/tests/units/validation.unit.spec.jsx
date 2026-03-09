import { expect } from 'chai';
import sinon from 'sinon';
import { validateMilitaryBaseConsistency } from '../../utils/validation';
import directDeposit33 from '../../config/chapters/33/bankAccountInfo/directDeposit';

describe('validateMilitaryBaseConsistency', () => {
  let errors;

  beforeEach(() => {
    errors = {
      address: {
        city: { addError: sinon.spy() },
        state: { addError: sinon.spy() },
        country: { addError: sinon.spy() },
      },
    };
  });

  it('returns early when address data is missing', () => {
    const mailingAddressData = { livesOnMilitaryBase: false, address: null };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.called).to.be.false;
  });

  it('shows error when military address used without military base checkbox', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: false,
      address: { city: 'APO', state: 'AE', country: 'USA' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.calledOnce).to.be.true;
    expect(errors.address.state.addError.calledOnce).to.be.true;

    // Verify the error message content
    expect(errors.address.city.addError.firstCall.args[0]).to.contain(
      "Military addresses require the 'I live on a United States military base outside of the Country' checkbox to be selected.",
    );
    expect(errors.address.state.addError.firstCall.args[0]).to.contain(
      "Military addresses require the 'I live on a United States military base outside of the Country' checkbox to be selected.",
    );
  });

  it('shows error when civilian address used with military base checkbox', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: true,
      address: { city: 'Austin', state: 'TX', country: 'USA' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.calledOnce).to.be.true;
    expect(errors.address.state.addError.calledOnce).to.be.true;
  });

  it('shows error when non-USA country used with military base checkbox', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: true,
      address: { city: 'APO', state: 'AE', country: 'CAN' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.country.addError.calledOnce).to.be.true;
  });

  it('passes validation for correct military address', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: true,
      address: { city: 'APO', state: 'AE', country: 'USA' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.called).to.be.false;
    expect(errors.address.state.addError.called).to.be.false;
  });

  it('passes validation for correct civilian address', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: false,
      address: { city: 'Austin', state: 'TX', country: 'USA' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.called).to.be.false;
    expect(errors.address.state.addError.called).to.be.false;
  });

  it('includes DPO option in error message', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: true,
      address: { city: 'Austin', state: 'TX', country: 'USA' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.calledOnce).to.be.true;
    expect(errors.address.city.addError.firstCall.args[0]).to.contain('or DPO');
  });

  it('validates all military postal and state codes correctly', () => {
    const militaryCities = ['APO', 'FPO', 'DPO'];
    const militaryStates = ['AE', 'AA', 'AP'];

    militaryCities.forEach(city => {
      const mailingAddressData = {
        livesOnMilitaryBase: false,
        address: { city, state: 'NY', country: 'USA' },
      };
      const testErrors = {
        address: {
          city: { addError: sinon.spy() },
          state: { addError: sinon.spy() },
        },
      };
      validateMilitaryBaseConsistency(testErrors, mailingAddressData, {});
      expect(testErrors.address.city.addError.calledOnce).to.be.true;
      expect(testErrors.address.city.addError.firstCall.args[0]).to.contain(
        "Military addresses require the 'I live on a United States military base outside of the Country' checkbox to be selected.",
      );
    });

    militaryStates.forEach(state => {
      const mailingAddressData = {
        livesOnMilitaryBase: false,
        address: { city: 'Austin', state, country: 'USA' },
      };
      const testErrors = {
        address: {
          city: { addError: sinon.spy() },
          state: { addError: sinon.spy() },
        },
      };
      validateMilitaryBaseConsistency(testErrors, mailingAddressData, {});
      expect(testErrors.address.state.addError.calledOnce).to.be.true;
      expect(testErrors.address.state.addError.firstCall.args[0]).to.contain(
        "Military addresses require the 'I live on a United States military base outside of the Country' checkbox to be selected.",
      );
    });
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount
        .routingNumberConfirmation['ui:validations'][0];
    validationFn(errors, '987654321', formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Your bank routing number must match',
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount.routingNumber[
        'ui:validations'
      ][1];
    validationFn(errors, '123456789', formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Your bank routing number and bank account number cannot match',
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount.accountNumber[
        'ui:validations'
      ][1];
    validationFn(errors, '123456789', formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Your bank routing number and bank account number cannot match',
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount.routingNumber[
        'ui:validations'
      ][1];
    routingValidationFn(errors, '123456789', formData);

    expect(errors.addError.called).to.be.false;

    const accountValidationFn =
      directDeposit33.uiSchema['view:directDeposit'].bankAccount.accountNumber[
        'ui:validations'
      ][1];
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount.routingNumber[
        'ui:validations'
      ][1];
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
      directDeposit33.uiSchema['view:directDeposit'].bankAccount.accountNumber[
        'ui:validations'
      ][1];
    accountValidationFn(errors, '', formDataEmptyAccount);

    expect(errors.addError.called).to.be.false;
  });
});
