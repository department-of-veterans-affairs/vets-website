import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Hca provider and policy', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.providerAndPolicy;

  it('should reveal required insurance providers', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = findDOMNode(form);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
  });

  it('should add another', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = findDOMNode(form);
    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_providers_0_insuranceName'),
      {
        target: {
          value: 'Insurer name',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_providers_0_insurancePolicyHolderName'),
      {
        target: {
          value: 'Testing',
        },
      },
    );
    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_providers_0_insurancePolicyNumber'),
      {
        target: {
          value: '123123',
        },
      },
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
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_providers_0_insuranceName'),
      {
        target: {
          value: 'Insurer name',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_providers_0_insurancePolicyHolderName'),
      {
        target: {
          value: 'Testing',
        },
      },
    );

    submitForm(form);
    expect(onSubmit.called).to.be.false;

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_providers_0_insuranceGroupCode'),
      {
        target: {
          value: '123',
        },
      },
    );

    submitForm(form);
    expect(onSubmit.called).to.be.true;
  });
});
