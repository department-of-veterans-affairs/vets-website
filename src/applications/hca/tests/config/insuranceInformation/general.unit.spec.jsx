import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';
import { simulateInputChange } from '../../helpers';

describe('hca GeneralInsurance config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.general;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    expect(formDOM.querySelectorAll('input').length).to.equal(2);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = findDOMNode(form);
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should reveal required insurance providers', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    expect(formDOM.querySelectorAll('input, select').length).to.equal(2);

    simulateInputChange(formDOM, '#root_isCoveredByHealthInsuranceYes', 'Y');
    expect(formDOM.querySelectorAll('input, select').length).to.equal(6);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
  });

  it('should add another', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = findDOMNode(form);

    simulateInputChange(formDOM, '#root_isCoveredByHealthInsuranceYes', 'Y');
    simulateInputChange(
      formDOM,
      '#root_providers_0_insuranceName',
      'Insurer name',
    );
    simulateInputChange(
      formDOM,
      '#root_providers_0_insurancePolicyHolderName',
      'Testing',
    );
    simulateInputChange(
      formDOM,
      '#root_providers_0_insurancePolicyNumber',
      '123123',
    );

    submitForm(form);
    expect(onSubmit.called).to.be.true;

    ReactTestUtils.Simulate.click(
      formDOM.querySelector('.va-growable-add-btn'),
    );

    expect(
      formDOM.querySelector('.va-growable-background').textContent,
    ).to.contain('Insurer name');
  });

  it('should require one of policy number or group code', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = findDOMNode(form);

    simulateInputChange(formDOM, '#root_isCoveredByHealthInsuranceYes', 'Y');
    simulateInputChange(
      formDOM,
      '#root_providers_0_insuranceName',
      'Insurer name',
    );
    simulateInputChange(
      formDOM,
      '#root_providers_0_insurancePolicyHolderName',
      'Testing',
    );
    submitForm(form);

    expect(onSubmit.called).to.be.false;

    simulateInputChange(formDOM, '#root_providers_0_insuranceGroupCode', '123');
    submitForm(form);

    expect(onSubmit.called).to.be.true;
  });
});
