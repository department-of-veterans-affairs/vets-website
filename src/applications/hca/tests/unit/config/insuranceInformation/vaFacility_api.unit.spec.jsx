import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';

import {
  DefinitionTester,
  submitForm,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../../config/form';
import { simulateInputChange } from '../../../helpers';

describe('hca VaFacilityLighthouse config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.vaFacilityJson;
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
    expect(formDOM.querySelectorAll('input, select').length).to.equal(5);
    // with no state selected, the facilities list should include only a blank placeholder
    expect(
      formDOM
        .querySelector('#root_view\\3A preferredFacility_vaMedicalFacility')
        .querySelectorAll('option').length,
    ).to.equal(1);
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
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

    simulateInputChange(
      formDOM,
      '#root_view\\3A preferredFacility_view\\3A facilityState',
      'MA',
    );
    simulateInputChange(
      formDOM,
      '#root_view\\3A preferredFacility_vaMedicalFacility',
      '631',
    );
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should set facilities list based on state selection', () => {
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

    simulateInputChange(
      formDOM,
      '#root_view\\3A preferredFacility_view\\3A facilityState',
      'MA',
    );

    expect(
      formDOM
        .querySelector('#root_view\\3A preferredFacility_vaMedicalFacility')
        .querySelectorAll('option').length,
    ).to.be.greaterThan(1);
  });
});
