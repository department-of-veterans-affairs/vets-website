import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Hca VA facility', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.vaFacilityJson;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} uiSchema={uiSchema} definitions={{}} />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(5);
    // with no state selected, the facilities list should include only a blank placeholder
    expect(
      formDOM.querySelectorAll('select')[1].querySelectorAll('option').length,
    ).to.equal(1);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={{}}
        onSubmit={onSubmit}
      />,
    );
    const formDOM = findDOMNode(form);

    submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  it('should set facilities list based on state selection', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={{}}
        onSubmit={onSubmit}
      />,
    );
    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(formDOM.querySelectorAll('select')[0], {
      target: {
        value: 'MA',
      },
    });

    expect(
      formDOM.querySelectorAll('select')[1].querySelectorAll('option').length,
    ).to.be.greaterThan(1);
  });

  it('should submit with valid required data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={{}}
        onSubmit={onSubmit}
      />,
    );
    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(formDOM.querySelectorAll('select')[0], {
      target: {
        value: 'MA',
      },
    });

    ReactTestUtils.Simulate.change(formDOM.querySelectorAll('select')[1], {
      target: {
        value: '631',
      },
    });

    submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
