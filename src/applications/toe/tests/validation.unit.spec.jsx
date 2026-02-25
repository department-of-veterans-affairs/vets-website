import { expect } from 'chai';
import sinon from 'sinon';
import { isValidGivenName, isValidLastName } from '../utils/validation';
import formConfig from '../config/form';

describe('first middle name validation', () => {
  describe('valid given names', () => {
    it('Jane is a valid name', () => {
      const name = 'Jane';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Single-character names are valid', () => {
      const name = 'Q';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with leading spaces is valid', () => {
      const name = '                    Jane';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with trailing spaces is valid', () => {
      const name = 'George                    ';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with hyphen is valid', () => {
      const name = 'George-Lawrence';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with prime is valid', () => {
      const name = "Ter'Rico";
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with apostrophe is valid', () => {
      const name = 'Ter’Rico';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with space is valid', () => {
      const name = 'Jane Louise';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });
    it('Name with 20 characters and leading and trailing whitespace is valid', () => {
      const name = "    J'ne Ter’Rico-Kaiden      ";
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.true;
    });

    it('Name without leading letter is not valid', () => {
      const name = '-Nope';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
    it('Name without leading letter 2 is not valid', () => {
      const name = "'Nope";
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
    it('Name without leading letter 3 is not valid', () => {
      const name = '’Nope';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
    it('Name with 21 characters is not valid', () => {
      const name = 'Jane Jane Jane Jane L';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
    it('Name with number is not valid', () => {
      const name = 'King George 3';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
    it('Name with $ is not valid', () => {
      const name = 'Name$';
      const isValid = isValidGivenName(name);

      expect(isValid).to.be.false;
    });
  });

  describe('valid last names', () => {
    it('Johnson is a valid last name', () => {
      const name = 'Johnson';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Single-character last names are valid', () => {
      const name = 'X';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with leading spaces is valid', () => {
      const name = '                    Johnson';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with trailing spaces is valid', () => {
      const name = 'Johnson                    ';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with hyphen is valid', () => {
      const name = 'Johnson-Johnston';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with prime is valid', () => {
      const name = "M'Cheyne";
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with apostrophe is valid', () => {
      const name = 'M’Cheyne';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with space is valid', () => {
      const name = 'Johnson Johnston';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });
    it('Last name with 26 characters and leading and trailing whitespace is valid', () => {
      const name = '  Johnson-Johnston-Jo-Jordan  ';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.true;
    });

    it('Last name without leading letter is not valid', () => {
      const name = '-Johns';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
    it('Last name without leading letter 2 is not valid', () => {
      const name = "'Johns";
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
    it('Last name without leading letter 3 is not valid', () => {
      const name = '’Johns';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
    it('Last name with 27 characters is not valid', () => {
      const name = 'Johnson-Jensen-Jordan-Jones';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
    it('Last name with number is not valid', () => {
      const name = 'J3n53n';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
    it('Last name with $ is not valid', () => {
      const name = 'Jone$';
      const isValid = isValidLastName(name);

      expect(isValid).to.be.false;
    });
  });
});

describe('Routing Number Confirmation Validation', () => {
  let errors;

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  const directDepositConfig =
    formConfig.chapters.bankAccountInfoChapter.pages.directDeposit;

  it('should show error when confirmation does not match routing number', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      bankAccount: {
        routingNumber: '123456789',
        routingNumberConfirmation: '987654321',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.routingNumberConfirmation[
        'ui:validations'
      ][0];
    validationFn(errors, '987654321', formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Your bank routing number must match',
    );
  });

  it('should not show error when confirmation matches routing number', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      bankAccount: {
        routingNumber: '123456789',
        routingNumberConfirmation: '123456789',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.routingNumberConfirmation[
        'ui:validations'
      ][0];
    validationFn(errors, '123456789', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not validate when feature flag is disabled', () => {
    const formData = {
      mebBankInfoConfirmationField: false,
      bankAccount: {
        routingNumber: '123456789',
        routingNumberConfirmation: '987654321',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.routingNumberConfirmation[
        'ui:validations'
      ][0];
    validationFn(errors, '987654321', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not show error when confirmation field is empty', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      bankAccount: {
        routingNumber: '123456789',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.routingNumberConfirmation[
        'ui:validations'
      ][0];
    validationFn(errors, '', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not show error when routing number is missing', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      bankAccount: {
        routingNumberConfirmation: '123456789',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.routingNumberConfirmation[
        'ui:validations'
      ][0];
    validationFn(errors, '123456789', formData);

    expect(errors.addError.called).to.be.false;
  });
});

describe('Account Number Confirmation Validation', () => {
  let errors;

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  const directDepositConfig =
    formConfig.chapters.bankAccountInfoChapter.pages.directDeposit;

  it('should show error when confirmation does not match account number', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      bankAccount: {
        accountNumber: '12345678',
        accountNumberConfirmation: '87654321',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.accountNumberConfirmation[
        'ui:validations'
      ][0];
    validationFn(errors, '87654321', formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Your bank account number must match',
    );
  });

  it('should not show error when confirmation matches account number', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      bankAccount: {
        accountNumber: '12345678',
        accountNumberConfirmation: '12345678',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.accountNumberConfirmation[
        'ui:validations'
      ][0];
    validationFn(errors, '12345678', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not validate when feature flag is disabled', () => {
    const formData = {
      mebBankInfoConfirmationField: false,
      bankAccount: {
        accountNumber: '12345678',
        accountNumberConfirmation: '87654321',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.accountNumberConfirmation[
        'ui:validations'
      ][0];
    validationFn(errors, '87654321', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not show error when confirmation field is empty', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      bankAccount: {
        accountNumber: '12345678',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.accountNumberConfirmation[
        'ui:validations'
      ][0];
    validationFn(errors, '', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not show error when account number is missing', () => {
    const formData = {
      mebBankInfoConfirmationField: true,
      bankAccount: {
        accountNumberConfirmation: '12345678',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.accountNumberConfirmation[
        'ui:validations'
      ][0];
    validationFn(errors, '12345678', formData);

    expect(errors.addError.called).to.be.false;
  });
});

describe('Routing Number and Account Number Cannot Match Validation', () => {
  let errors;

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  const directDepositConfig =
    formConfig.chapters.bankAccountInfoChapter.pages.directDeposit;

  it('should show error on routing number field when routing number matches account number', () => {
    const formData = {
      bankAccount: {
        routingNumber: '123456789',
        accountNumber: '123456789',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.routingNumber[
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
      bankAccount: {
        routingNumber: '123456789',
        accountNumber: '123456789',
      },
    };

    const validationFn =
      directDepositConfig.uiSchema.bankAccount.accountNumber[
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
      bankAccount: {
        routingNumber: '123456789',
        accountNumber: '987654321',
      },
    };

    const routingValidationFn =
      directDepositConfig.uiSchema.bankAccount.routingNumber[
        'ui:validations'
      ][1];
    routingValidationFn(errors, '123456789', formData);

    expect(errors.addError.called).to.be.false;

    const accountValidationFn =
      directDepositConfig.uiSchema.bankAccount.accountNumber[
        'ui:validations'
      ][1];
    accountValidationFn(errors, '987654321', formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not show error when either field is empty', () => {
    const formDataEmptyRouting = {
      bankAccount: {
        routingNumber: '',
        accountNumber: '123456789',
      },
    };

    const routingValidationFn =
      directDepositConfig.uiSchema.bankAccount.routingNumber[
        'ui:validations'
      ][1];
    routingValidationFn(errors, '', formDataEmptyRouting);

    expect(errors.addError.called).to.be.false;

    const formDataEmptyAccount = {
      bankAccount: {
        routingNumber: '123456789',
        accountNumber: '',
      },
    };

    const accountValidationFn =
      directDepositConfig.uiSchema.bankAccount.accountNumber[
        'ui:validations'
      ][1];
    accountValidationFn(errors, '', formDataEmptyAccount);

    expect(errors.addError.called).to.be.false;
  });
});
