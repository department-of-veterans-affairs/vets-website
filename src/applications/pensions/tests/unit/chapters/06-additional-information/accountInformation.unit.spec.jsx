import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';

import {
  DefinitionTester,
  getFormDOM,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import fullSchemaPensions from '../../../../config/form';

describe('Pensions accountInformation', () => {
  const {
    schema,
    uiSchema,
  } = fullSchemaPensions.chapters.additionalInformation.pages.accountInformation;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} data={{}} uiSchema={uiSchema} />,
    );

    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(5);
  });

  it('should require bank account fields', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{
          'view:usingDirectDeposit': true,
        }}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(5);

    formDOM.submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
  });

  it('should show error on bad routing number', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} data={{}} uiSchema={uiSchema} />,
    );

    const formDOM = getFormDOM(form);

    const routingNumber = formDOM.querySelector(
      '#root_bankAccount_routingNumber',
    );

    formDOM.fillData('#root_bankAccount_routingNumber', '01234567');

    ReactTestUtils.Simulate.blur(routingNumber);

    expect(
      formDOM.querySelector('.usa-input-error #root_bankAccount_routingNumber'),
    ).not.to.be.null;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_bankAccount_accountType_0', 'checking');
    formDOM.fillData('#root_bankAccount_accountNumber', '1234');
    formDOM.fillData('#root_bankAccount_routingNumber', '122105155');

    formDOM.submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);

    expect(onSubmit.called).to.be.true;
  });
});
