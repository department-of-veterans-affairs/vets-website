import React from 'react';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import apiRequest from '@department-of-veterans-affairs/platform-utilities/api';
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(8);
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
    const fullName = screen.getByRole('textbox', {
      name: "Veteran's Full Name (*Required)",
    });
    const VeteranPhone = screen.getByRole('textbox', {
      name: "Veteran's Phone Number (*Required)",
    });
    const VeteranEmail = screen.getByRole('textbox', {
      name: "Veteran's Email Address (*Required)",
    });
    const accountTypeButton = screen.container.querySelector(
      'va-radio-option[label="Checking"]',
    );

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
    fireEvent.change(fullName, { target: { value: 'Jhon Doe' } });
    fireEvent.change(VeteranPhone, { target: { value: '3134567890' } });
    fireEvent.change(VeteranEmail, {
      target: { value: 'someemail@gmail.com' },
    });
    fireEvent.change(bankName, { target: { value: 'Test Bank Name' } });
    fireEvent.change(bankPhone, { target: { value: '1234567890' } });
    fireEvent.change(routingNumber, { target: { value: '123456789' } });
    fireEvent.change(accountNumber, { target: { value: '123' } });
    fireEvent.change(verifyAccountNumber, { target: { value: '123456' } });
    expect(bankName.value).to.equal('Test Bank Name');
    expect(bankPhone.value).to.equal('1234567890');
    expect(routingNumber.value).to.equal('123456789');
    expect(accountNumber.value).to.equal('123');
    expect(verifyAccountNumber.value).to.equal('123456');

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
  });

  it('Should submit form', async () => {
    const apiRequestStub = sinon.stub().resolves({ ok: true });
    sinon.stub(apiRequest, 'mockResolvedValue').returns(apiRequestStub);
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
    const fullName = screen.getByRole('textbox', {
      name: "Veteran's Full Name (*Required)",
    });
    const accountTypeButton = screen.container.querySelector(
      'va-radio-option[label="Checking"]',
    );
    const bankName = screen.getByRole('textbox', {
      name: /name of financial institution \(\*required\)/i,
    });
    const VeteranPhone = screen.getByRole('textbox', {
      name: "Veteran's Phone Number (*Required)",
    });
    const VeteranEmail = screen.getByRole('textbox', {
      name: "Veteran's Email Address (*Required)",
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
    fireEvent.change(fullName, { target: { value: 'Jhon Doe' } });
    fireEvent.change(VeteranPhone, { target: { value: '3134567890' } });
    fireEvent.change(VeteranEmail, {
      target: { value: 'someemail@gmail.com' },
    });
    fireEvent.change(bankName, { target: { value: 'Test Bank Name' } });
    fireEvent.change(bankPhone, { target: { value: '1234567890' } });
    fireEvent.change(routingNumber, { target: { value: '123456789' } });
    fireEvent.change(accountNumber, { target: { value: '123' } });
    fireEvent.change(verifyAccountNumber, { target: { value: '123' } });

    expect(bankName.value).to.equal('Test Bank Name');
    expect(bankPhone.value).to.equal('1234567890');
    expect(routingNumber.value).to.equal('123456789');
    expect(accountNumber.value).to.equal('123');
    expect(verifyAccountNumber.value).to.equal('123');
    const res = { data: {}, status: 204 };
    formDOM.submitForm();
    apiRequestStub.resolves(res);
    await waitFor(() => {
      expect(screen.getByTestId('alert')).to.exist;
    });
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    apiRequestStub.restore();
  });
});
