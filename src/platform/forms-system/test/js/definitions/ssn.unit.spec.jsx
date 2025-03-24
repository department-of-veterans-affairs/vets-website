import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import definitions from 'vets-json-schema/dist/definitions.json';
import uiSchema from '../../../src/js/definitions/ssn';

describe('Schemaform definition ssn', () => {
  it('should render ssn with error', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={definitions.ssn} uiSchema={uiSchema} />,
    );

    const formDOM = findDOMNode(form);
    const node = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    )[0];

    expect(Array.from(formDOM.querySelectorAll('.usa-input-error-message'))).to
      .be.empty;

    ReactTestUtils.Simulate.change(node, {
      target: {
        value: '123-34',
      },
    });
    ReactTestUtils.Simulate.blur(node);

    expect(
      formDOM.querySelector('.usa-input-error-message').textContent,
    ).to.equal(`Error ${uiSchema['ui:errorMessages'].pattern}`);
  });
  it('should render formatted ssn for review', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        reviewMode
        schema={definitions.ssn}
        uiSchema={uiSchema}
        data="123456789"
      />,
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelector('dd').textContent).to.equal('●●●-●●-6789');
  });
});
