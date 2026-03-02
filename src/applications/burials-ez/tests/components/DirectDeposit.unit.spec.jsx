import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import createDirectDepositPage from '../../components/DirectDeposit';

describe('DirectDeposit createDirectDepositPage', () => {
  it('returns expected page config shape', () => {
    const page = createDirectDepositPage();

    expect(page).to.have.property('title', 'Direct deposit');
    expect(page).to.have.property(
      'path',
      'additional-information/direct-deposit',
    );
    expect(page).to.have.property('uiSchema');
    expect(page).to.have.property('schema');
  });

  it('includes required bankAccount fields in schema', () => {
    const { schema } = createDirectDepositPage();

    const {
      properties: { bankAccount },
    } = schema;
    expect(bankAccount).to.exist;

    // required fields
    expect(bankAccount.required).to.deep.equal([
      'accountType',
      'routingNumber',
      'accountNumber',
    ]);

    // properties exist
    expect(bankAccount.properties).to.have.property('accountType');
    expect(bankAccount.properties).to.have.property('routingNumber');
    expect(bankAccount.properties).to.have.property('accountNumber');

    // view fields exist
    expect(bankAccount.properties).to.have.property('view:checkGuideDetails');
    expect(bankAccount.properties).to.have.property('view:bankInfoHelpText');
  });

  it('sets bankAccount ui:order to null to avoid conflicts', () => {
    const { uiSchema } = createDirectDepositPage();
    expect(uiSchema.bankAccount['ui:order']).to.equal(null);
  });

  it('renders EligibilityRegulationNote as the page description', () => {
    const { uiSchema } = createDirectDepositPage();
    const { container } = render(<>{uiSchema['ui:description']}</>);

    expect(container.textContent).to.include(
      'We make payments only through direct deposit',
    );
    expect(container.textContent).to.include(
      'If we approve your application for burial benefits',
    );
  });

  it('renders CheckGuideDetails description and includes the image alt text', () => {
    const { uiSchema } = createDirectDepositPage();

    const checkGuide = uiSchema.bankAccount['view:checkGuideDetails'];
    expect(checkGuide['ui:field']).to.equal('ViewField');

    const { container } = render(<>{checkGuide['ui:description']}</>);
    const img = container.querySelector('img');

    expect(img).to.exist;
    expect(img.getAttribute('src')).to.equal(
      '/img/direct-deposit-check-guide.svg',
    );
    expect(img.getAttribute('alt')).to.include('bank’s 9-digit routing number');
    expect(container.textContent).to.include(
      'Routing numbers must be 9-digits',
    );
  });

  it('renders bank info help text additional info trigger', () => {
    const { uiSchema } = createDirectDepositPage();

    const help = uiSchema.bankAccount['view:bankInfoHelpText'];
    expect(help['ui:field']).to.equal('ViewField');

    const { container } = render(<>{help['ui:description']}</>);
    const additionalInfo = container.querySelector('va-additional-info');
    expect(additionalInfo).to.exist;

    expect(additionalInfo.getAttribute('trigger')).to.equal(
      'What if I don’t have a bank account?',
    );
  });

  it('configures routingNumber field title, validations, and error messages', () => {
    const { uiSchema } = createDirectDepositPage();
    const routing = uiSchema.bankAccount.routingNumber;

    expect(routing['ui:title']).to.equal('Bank’s 9-digit routing number');
    expect(routing['ui:validations']).to.be.an('array');
    expect(routing['ui:validations']).to.have.length(1);
    expect(routing['ui:errorMessages']).to.deep.equal({
      pattern: 'Enter a valid 9-digit routing number',
      required: 'Enter a 9-digit routing number',
    });
  });

  it('routing number validation adds an error for invalid values', () => {
    const { uiSchema } = createDirectDepositPage();
    const validate = uiSchema.bankAccount.routingNumber['ui:validations'][0];

    const addError = sinon.spy();
    const errors = { addError };

    // invalid: not 9 digits
    validate(errors, '123');
    expect(addError.calledOnce).to.be.true;
    expect(addError.args[0][0]).to.equal(
      'Enter a valid 9-digit routing number',
    );
  });

  it('routing number validation does not error when value is empty', () => {
    const { uiSchema } = createDirectDepositPage();
    const validate = uiSchema.bankAccount.routingNumber['ui:validations'][0];

    const addError = sinon.spy();
    const errors = { addError };

    validate(errors, '');
    expect(addError.called).to.be.false;

    validate(errors, undefined);
    expect(addError.called).to.be.false;
  });

  it('wires up MaskedBankAccountInfo as the webComponentField for routing and account number', () => {
    const { uiSchema } = createDirectDepositPage();

    expect(uiSchema.bankAccount.routingNumber['ui:webComponentField']).to.exist;
    expect(uiSchema.bankAccount.accountNumber['ui:webComponentField']).to.exist;

    // Both should use the same component
    expect(uiSchema.bankAccount.routingNumber['ui:webComponentField']).to.equal(
      uiSchema.bankAccount.accountNumber['ui:webComponentField'],
    );
  });
});
