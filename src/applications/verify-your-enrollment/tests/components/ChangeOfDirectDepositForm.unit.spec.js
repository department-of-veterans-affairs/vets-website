import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import {
  getFormDOM,
  DefinitionTester,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

import ChangeOfDirectDepositForm, {
  makeSchemas,
} from '../../components/ChangeOfDirectDepositForm';

const dummyProps = {
  title: 'TEST Direct Deposit Information',
  formChange: () => {},
  formData: {},
  formPrefix: 'test-',
  formSubmit: () => {},
};

const schemaObj = makeSchemas('test-schema-');

describe('Change Of Direct Deposit Form', () => {
  it('renders without crashing', () => {
    const wrapper = render(<ChangeOfDirectDepositForm {...dummyProps} />);
    expect(wrapper).to.be.not.null;
  });

  it('Should not submit blank form', () => {
    const screen = render(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schemaObj.schema}
        data={{}}
        formData={{}}
        uiSchema={schemaObj.uiSchema}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );
    const formDOM = getFormDOM(screen);
    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(9);
  });

  it('Should raise one error with the account validation', () => {
    const screen = render(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schemaObj.schema}
        data={{}}
        formData={{}}
        uiSchema={schemaObj.uiSchema}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );
    const formDOM = getFormDOM(screen);
    const accountTypeButton = screen.getByRole('radio', { name: /checking/i });
    const bankName = screen.getByRole('textbox', {
      name: /name of financial institution \(\*required\)/i,
    });
    const bankPhone = screen.getByRole('textbox', {
      name: /telephone number of financial institution \(\*required\)/i,
    });
    const routingNumber = screen.getByRole('textbox', {
      name: /routing number \(\*required\)/i,
    });
    const accountNumber = screen.getByRole('textbox', {
      name: /account number \(this should be no more than 17 digits\) \(\*required\)/i,
    });
    const verifyAccountNumber = screen.getByRole('textbox', {
      name: /verify account number \(\*required\)/i,
    });

    fireEvent.click(accountTypeButton);
    fireEvent.change(bankName, { target: { value: 'Test Bank Name' } });
    fireEvent.change(bankPhone, { target: { value: '1234567890' } });
    fireEvent.change(routingNumber, { target: { value: '123456789' } });
    fireEvent.change(accountNumber, { target: { value: '123' } });
    fireEvent.change(verifyAccountNumber, { target: { value: '123456' } });

    expect(accountTypeButton.checked).to.be.true;
    expect(bankName.value).to.equal('Test Bank Name');
    expect(bankPhone.value).to.equal('1234567890');
    expect(routingNumber.value).to.equal('123456789');
    expect(accountNumber.value).to.equal('123');
    expect(verifyAccountNumber.value).to.equal('123456');

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
  });

  it('Should submit form', () => {
    const screen = render(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schemaObj.schema}
        data={{}}
        formData={{}}
        uiSchema={schemaObj.uiSchema}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );
    const formDOM = getFormDOM(screen);
    const accountTypeButton = screen.getByRole('radio', { name: /Checking/i });
    const bankName = screen.getByRole('textbox', {
      name: /name of financial institution \(\*required\)/i,
    });
    const bankPhone = screen.getByRole('textbox', {
      name: /telephone number of financial institution \(\*required\)/i,
    });
    const routingNumber = screen.getByRole('textbox', {
      name: /routing number \(\*required\)/i,
    });
    const accountNumber = screen.getByRole('textbox', {
      name: /account number \(this should be no more than 17 digits\) \(\*required\)/i,
    });
    const verifyAccountNumber = screen.getByRole('textbox', {
      name: /verify account number \(\*required\)/i,
    });

    fireEvent.click(accountTypeButton);
    fireEvent.change(bankName, { target: { value: 'Test Bank Name' } });
    fireEvent.change(bankPhone, { target: { value: '1234567890' } });
    fireEvent.change(routingNumber, { target: { value: '123456789' } });
    fireEvent.change(accountNumber, { target: { value: '123' } });
    fireEvent.change(verifyAccountNumber, { target: { value: '123' } });

    expect(accountTypeButton.checked).to.be.true;
    expect(bankName.value).to.equal('Test Bank Name');
    expect(bankPhone.value).to.equal('1234567890');
    expect(routingNumber.value).to.equal('123456789');
    expect(accountNumber.value).to.equal('123');
    expect(verifyAccountNumber.value).to.equal('123');

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
  });
});
