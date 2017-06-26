import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';

import { DefinitionTester, getFormDOM } from '../../util/schemaform-utils.jsx';
import fullSchemaPensions from '../../../src/js/pensions/config/form';

describe('Pensions directDeposit', () => {
  const { schema, uiSchema } = fullSchemaPensions.chapters.additionalInformation.pages.directDeposit;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(3);
  });

  it('should render no fields', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);
    formDOM.fillData('#root_view\\:bankAccountChange_1', 'continue');

    expect(formDOM.querySelectorAll('input').length).to.equal(3);
  });

  it('should render stop message', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);
    formDOM.fillData('#root_view\\:bankAccountChange_2', 'stop');

    expect(formDOM.querySelector('.pension-dd-warning')).to.not.be.null;
  });

  it('should require bank account fields', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);
    formDOM.fillData('#root_view\\:bankAccountChange_0', 'start');

    expect(formDOM.querySelectorAll('input').length).to.equal(8);

    formDOM.submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
  });

  it('should show error on bad routing number', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);
    formDOM.fillData('#root_view\\:bankAccountChange_0', 'start');

    const routingNumber = formDOM.querySelector('#root_bankAccount_routingNumber');
    ReactTestUtils.Simulate.blur(routingNumber);

    formDOM.fillData('#root_bankAccount_routingNumber', '01234567');

    expect(formDOM.querySelector('.usa-input-error #root_bankAccount_routingNumber')).not.to.be.null;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);
    formDOM.fillData('#root_view\\:bankAccountChange_0', 'start');

    formDOM.fillData('#root_bankAccount_accountType_0', 'checking');
    formDOM.fillData('#root_bankAccount_accountNumber', '1234');
    formDOM.fillData('#root_bankAccount_routingNumber', '122105155');

    formDOM.submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);

    expect(onSubmit.called).to.be.true;
  });
});
